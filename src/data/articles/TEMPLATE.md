# 新增文章指南

## 快速开始

### 步骤 1: 创建新文件
在 `src/data/articles/` 目录下创建新文件，命名格式: `NNN-slug-name.js`
- NNN: 三位数字，递增（如 006, 007, 008...）
- slug-name: 文章的英文 slug（用于 URL）

### 步骤 2: 复制模板
```javascript
/**
 * 文章: 你的文章标题
 * 说明: 简短的文章描述
 */
export default {
  id: 6,                              // 递增的数字 ID
  title: '你的文章标题',
  excerpt: '简短摘要，显示在列表中...',
  date: '2025-03-23',                // YYYY-MM-DD 格式
  category: '生活随笔',              // 分类名称
  readTime: '5分钟阅读',              // 阅读时间
  slug: 'article-slug',              // URL slug（不能重复）
  content: `# 文章标题

## 第一段落
文章内容...

## 第二段落
继续内容...`,
}
```

### 步骤 3: 修改 articles.js
在 `src/data/articles.js` 中：

1. **添加导入**：
```javascript
import article006 from './articles/006-your-article-slug.js'
```

2. **添加到数组**：
```javascript
export const articles = [
  article006,  // ← 新增
  article003,
  article001,
  // ...其他文章
].sort((a, b) => new Date(b.date) - new Date(a.date))
```

### 步骤 4: 完成
刷新网页，新文章会自动出现在列表中并按日期排序！

---

## 示例

### 创建文件: `006-typescript-tips.js`
```javascript
/**
 * 文章: TypeScript 实用技巧
 * 说明: 分享一些 TS 开发中的常见技巧和最佳实践
 */
export default {
  id: 6,
  title: 'TypeScript 实用技巧',
  excerpt: '分享一些 TypeScript 开发中的常见技巧和最佳实践...',
  date: '2025-03-23',
  category: '技术分享',
  readTime: '8分钟阅读',
  slug: 'typescript-tips',
  content: `# TypeScript 实用技巧

## 1. 使用 Pick 提取接口字段

\`\`\`typescript
interface User {
  name: string
  email: string
  age: number
}

type UserPreview = Pick<User, 'name' | 'email'>
\`\`\`

## 2. 使用 Omit 排除字段

\`\`\`typescript
type UserWithoutAge = Omit<User, 'age'>
\`\`\``,
}
```

### 修改 articles.js
```javascript
import article001 from './articles/001-winter-warmth.js'
import article002 from './articles/002-kyoto-walk.js'
import article003 from './articles/003-reading-to-live.js'
import article004 from './articles/004-night-photography-tips.js'
import article005 from './articles/005-yuan-lai-ni-ye-wan.js'
import article006 from './articles/006-typescript-tips.js'  // ← 新增

export const articles = [
  article006,  // ← 新增
  article003,
  article001,
  article002,
  article004,
  article005,
].sort((a, b) => new Date(b.date) - new Date(a.date))
```

---

## 注意事项

- ✅ **ID 必须唯一**且递增
- ✅ **slug 必须唯一**（用于 URL 路由）
- ✅ **日期格式**必须是 `YYYY-MM-DD`
- ✅ **Content 支持 Markdown** 语法
- ✅ **Category 建议使用现有分类**（生活随笔、旅行日记、读书笔记等）

---

## 文件结构

```
src/data/
├── articles.js                          (导入器 - 无需修改)
└── articles/                            (文章目录)
    ├── 001-winter-warmth.js
    ├── 002-kyoto-walk.js
    ├── 003-reading-to-live.js
    ├── 004-night-photography-tips.js
    ├── 005-yuan-lai-ni-ye-wan.js
    ├── 006-typescript-tips.js            (新增示例)
    └── TEMPLATE.md                      (本文件)
```

---

## 常见问题

**Q: 能否直接修改已有文章？**  
A: 可以！直接编辑对应的 `NNN-slug.js` 文件即可，无需修改 articles.js

**Q: 如何删除文章？**  
A: 
1. 删除对应的文件（如 `005-yuan-lai-ni-ye-wan.js`）
2. 在 articles.js 中删除对应的 import 和数组项

**Q: Content 中能否使用 HTML？**  
A: 支持！可以混用 Markdown 和 HTML，但建议主要使用 Markdown

**Q: 多人协作如何处理 ID 冲突？**  
A: 先在 articles.js 中看最后一个 ID，新增时 +1 即可

---

**Happy Writing! 🎉**
