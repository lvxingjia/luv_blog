/**
 * API: RAG 搜索接口 (Vercel 云函数)
 * 使用阿里云 DashScope Embedding 生成向量
 * 使用 Pinecone 进行向量搜索
 * 使用阿里云 DashScope Chat 生成 AI 回答（流式）
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

export default async (req, res) => {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { query, topK = 5 } = req.body

  if (!query) {
    res.write(
      `data: ${JSON.stringify({ error: '需要提供 query 参数' })}\n\n`
    )
    return res.end()
  }

  try {
    console.log(`[search] 用户查询: "${query}"`)

    // 1. 用 DashScope 生成查询向量
    console.log('[search] 正在生成查询向量...')
    const embeddingResponse = await axios.post(
      `${dashscopeApi}/embeddings`,
      {
        model: process.env.DASHSCOPE_EMBEDDING_MODEL || 'text-embedding-v3',
        input: {
          texts: [query],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    if (embeddingResponse.data.code !== '200') {
      throw new Error(
        `DashScope Embedding 错误: ${embeddingResponse.data.message}`
      )
    }

    const queryVector = embeddingResponse.data.output.embeddings[0].embedding
    console.log(`[search] ✓ 向量生成成功 (维度: ${queryVector.length})`)

    // 2. 在 Pinecone 中搜索
    console.log(`[search] 正在 Pinecone 中搜索 (top-${topK})...`)
    const pineconeClient = getPinecone()
    const index = pineconeClient.index(
      process.env.PINECONE_INDEX_NAME || 'luv-blog'
    )
    const searchResults = await index.query({
      vector: queryVector,
      topK: topK,
      includeMetadata: true,
    })

    console.log(`[search] ✓ 找到 ${searchResults.matches.length} 个相关结果`)

    // 3. 构建上下文
    const contextParts = searchResults.matches.map(
      (m, idx) =>
        `【文章 ${idx + 1}: ${m.metadata.article_title}】\n${m.metadata.text}\n---`
    )
    const context = contextParts.join('\n\n')

    console.log('[search] 正在调用 DashScope Chat API...')

    // 4. 用 DashScope 大模型生成回答（流式）
    const chatResponse = await axios.post(
      `${dashscopeApi}/services/aigc/text-generation/streaming`,
      {
        model: process.env.DASHSCOPE_CHAT_MODEL || 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: `你是 Luv 的博客 AI 助手。根据提供的文章内容回答用户的问题。

如果文章中没有相关内容，请直接说"我的文章中暂无相关内容，欢迎继续阅读其他文章"。
回答时保持友好和专业的语气，使用中文。`,
          },
          {
            role: 'user',
            content: `根据以下文章内容回答用户的问题。

【参考文章内容】
${context}

【用户问题】
${query}`,
          },
        ],
        parameters: {
          temperature: 0.7,
          top_p: 0.8,
          max_tokens: 1024,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
        timeout: 60000,
      }
    )

    // 5. 处理流式响应
    let isFinished = false

    chatResponse.data.on('data', (chunk) => {
      const lines = chunk.toString('utf-8').split('\n')

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const json = JSON.parse(line.substring(5))

            // DashScope 流式响应格式
            if (json.output && json.output.choices) {
              const content = json.output.choices[0]?.message?.content || ''
              if (content) {
                res.write(
                  `data: ${JSON.stringify({ content, type: 'text' })}\n\n`
                )
              }
            }

            // 检测流结束
            if (json.output?.finish_reason === 'stop') {
              isFinished = true
              res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
            }
          } catch (e) {
            // 忽略 JSON 解析错误
            console.log('[search] 忽略一行: ', line.substring(0, 50))
          }
        }
      }
    })

    chatResponse.data.on('end', () => {
      if (!isFinished) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
      }
      console.log('[search] ✓ 流式响应完成')
      res.end()
    })

    chatResponse.data.on('error', (error) => {
      console.error('[search] 流错误:', error.message)
      res.write(
        `data: ${JSON.stringify({ error: '流处理错误: ' + error.message })}\n\n`
      )
      res.end()
    })
  } catch (error) {
    console.error('[search] RAG 搜索错误:', error.message)
    if (error.response) {
      console.error('[search] 响应数据:', error.response.data)
    }
    res.write(
      `data: ${JSON.stringify({
        error:
          error.response?.data?.message || error.message || '查询失败',
      })}\n\n`
    )
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()
  }
}