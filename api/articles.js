/**
 * API: 获取文章列表 (Vercel 云函数)
 * 从 GitHub Raw 获取 articles.js 并解析
 */

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // 从 GitHub Raw 获取 articles.js
    // ⚠️ 请替换下面的 GitHub URL 中的 "你的用户名" 和 "你的仓库"
    const GITHUB_REPO_URL =
      process.env.GITHUB_REPO_URL ||
      'https://raw.githubusercontent.com/你的用户名/你的仓库/main/src/data/articles.js'

    console.log('[articles] 正在从 GitHub 获取文章列表...')
    const response = await fetch(GITHUB_REPO_URL)

    if (!response.ok) {
      throw new Error(`GitHub 返回 ${response.status}`)
    }

    const text = await response.text()

    // 解析 JavaScript 模块导出
    const articles = eval(`(function() { ${text}; return articles; })()`)

    // 按日期排序（最新的在前）
    const sorted = articles.sort((a, b) => new Date(b.date) - new Date(a.date))

    console.log(`[articles] 成功获取 ${sorted.length} 篇文章`)
    return res.status(200).json(sorted)
  } catch (error) {
    console.error('[articles] 获取文章错误:', error)
    return res.status(500).json({
      error: error.message,
      hint: '请检查 GITHUB_REPO_URL 环境变量是否正确配置',
    })
  }
}
