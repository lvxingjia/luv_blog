/**
 * 文章数据聚合器
 * 说明: 自动导入 articles 文件夹下的所有文章
 * 新增文章: 只需在 articles/ 文件夹下创建新的 JS 文件即可，无需修改本文件
 */
import article001 from './articles/001-winter-warmth.js'
import article002 from './articles/002-kyoto-walk.js'
import article003 from './articles/003-reading-to-live.js'
import article004 from './articles/004-night-photography-tips.js'
import article005 from './articles/005-yuan-lai-ni-ye-wan.js'
import article006 from './articles/006-web-deploy.js'
import article007 from './articles/007-rag-deveop.js'

// 按发布日期倒序排列（最新的在前）
export const articles = [
  article007, // 2026-03-25
  article006, // 2026-03-24
  article003, // 2025-10-10
  article001, // 2024-01-15
  article002, // 2024-01-12
  article004, // 2024-01-08
  article005, // 2023-09-28
].sort((a, b) => new Date(b.date) - new Date(a.date))
