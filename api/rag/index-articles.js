/**
 * API: 向量化文章索引接口 (Vercel 云函数)
 * 获取所有文章 → 文本分块 → 用 DashScope 生成向量 → 存储到 Pinecone
 * 
 * 调用方式:
 * POST /api/rag/index-articles
 * Header: Authorization: Bearer {CRON_SECRET}
 */

import axios from 'axios'
import { Pinecone } from '@pinecone-database/pinecone'

const dashscopeApi = 'https://dashscope.aliyuncs.com/api/v1'

let pinecone
function getPinecone() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }
  return pinecone
}

/**
 * 文本分块函数
 * @param {string} text - 原始文本
 * @param {number} chunkSize - 每块大小（字符数）
 * @param {number} overlap - 块之间的重叠字符数
 * @returns {string[]} - 文本块数组
 */
function chunkText(text, chunkSize = 500, overlap = 100) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.substring(i, i + chunkSize)
    if (chunk.trim().length > 0) {
      chunks.push(chunk)
    }
  }
  return chunks
}

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  // 验证定时任务 Token
  const authHeader = req.headers.authorization || ''
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'empty'}`

  if (authHeader !== expectedAuth) {
    console.log('[index] ❌ 未授权的请求')
    return res.status(401).json({ error: '未授权: 缺少有效的 Authorization Token' })
  }

  try {
    console.log('[index] ========== 开始索引文章 ==========')

    // 1. 获取所有文章
    console.log('[index] 步骤 1/4: 获取所有文章...')
    const articlesResponse = await fetch(
      `https://${req.headers.host}/api/articles`
    )

    if (!articlesResponse.ok) {
      throw new Error(`无法获取文章列表: ${articlesResponse.status}`)
    }

    const articles = await articlesResponse.json()
    console.log(`[index] ✓ 获取到 ${articles.length} 篇文章`)

    // 2. 获取 Pinecone 索引
    console.log('[index] 步骤 2/4: 连接 Pinecone...')
    const pineconeClient = getPinecone()
    const index = pineconeClient.index(
      process.env.PINECONE_INDEX_NAME || 'luv-blog'
    )
    console.log('[index] ✓ Pinecone 连接成功')

    let totalChunks = 0
    let totalIndexed = 0
    const indexingDetails = []

    // 3. 遍历文章，生成向量
    console.log('[index] 步骤 3/4: 向量化文章...')
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      console.log(`[index] 正在处理 [${i + 1}/${articles.length}]: ${article.title}`)

      try {
        // 分块
        const chunks = chunkText(article.content)
        totalChunks += chunks.length
        console.log(`[index]   → 分块: ${chunks.length} 块`)

        // 批量生成向量
        console.log(`[index]   → 生成向量...`)
        const embeddingResponse = await axios.post(
          `${dashscopeApi}/embeddings`,
          {
            model: process.env.DASHSCOPE_EMBEDDING_MODEL || 'text-embedding-v3',
            input: {
              texts: chunks,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 60000,
          }
        )

        if (embeddingResponse.data.code !== '200') {
          throw new Error(
            `DashScope 错误: ${embeddingResponse.data.message}`
          )
        }

        const vectors = embeddingResponse.data.output.embeddings
        console.log(
          `[index]   ✓ 向量生成成功 (${vectors.length} 个向量)`
        )

        // 准备 Pinecone 上传数据
        const upsertData = vectors.map((vec, idx) => ({
          id: `${article.id}_${idx}`,
          values: vec.embedding,
          metadata: {
            article_id: article.id,
            article_title: article.title,
            article_slug: article.slug,
            category: article.category,
            text: chunks[idx],
            source_url: `/post/${article.slug}`,
            indexed_at: new Date().toISOString(),
          },
        }))

        // 存储到 Pinecone
        console.log(`[index]   → 上传到 Pinecone...`)
        await index.upsert(upsertData)
        totalIndexed += upsertData.length

        console.log(
          `[index] ✓ ${article.title} 索引完成 (${upsertData.length} 块)`
        )
        indexingDetails.push({
          title: article.title,
          chunks: upsertData.length,
          status: 'success',
        })

        // 避免 API 限流，添加延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`[index] ✗ ${article.title} 失败: ${error.message}`)
        indexingDetails.push({
          title: article.title,
          status: 'failed',
          error: error.message,
        })
      }
    }

    console.log('[index] 步骤 4/4: 索引统计')
    console.log(`[index] ✓ 本次索引完成!`)
    console.log(`[index]   - 文章数: ${articles.length}`)
    console.log(`[index]   - 总文本块: ${totalChunks}`)
    console.log(`[index]   - 已索引块: ${totalIndexed}`)
    console.log('[index] ========== 索引完成 ==========')

    return res.status(200).json({
      success: true,
      message: `索引完成: 共 ${articles.length} 篇文章, ${totalIndexed} 个文本块成功索引`,
      summary: {
        articles: articles.length,
        totalChunks: totalChunks,
        indexedChunks: totalIndexed,
        timestamp: new Date().toISOString(),
      },
      details: indexingDetails,
    })
  } catch (error) {
    console.error('[index] ❌ 索引失败:', error.message)
    if (error.response) {
      console.error('[index] 响应数据:', error.response.data)
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    })
  }
}
