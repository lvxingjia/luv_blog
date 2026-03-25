# RAG 系统部署指南

## 📋 快速检查清单

> 按照这个顺序完成配置，确保系统正常运行

### ✅ 第 1 步：获取必要的 API Keys

#### 1.1 阿里云 DashScope

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 登录或注册（需要实名认证）
3. 复制 API Key
4. **检查免费额度**：应该有 200 万 tokens/月

**保存**: `DASHSCOPE_API_KEY=sk_xxxxx`

#### 1.2 Pinecone 向量数据库

1. 访问 [Pinecone 官网](https://www.pinecone.io/)
2. 创建免费账户
3. 创建新索引，配置如下：
   - **索引名称**: `luv-blog`
   - **维度**: `768` ⚠️ **必须是 768**
   - **Metric**: `cosine`
4. 创建 API Key（选择 "Create API key"）

**保存**: `PINECONE_API_KEY=pk_xxxxx`

### ✅ 第 2 步：在 Vercel 配置环境变量

1. 登录 [Vercel 控制台](https://vercel.com/)
2. 进入你的项目 → Settings
3. 找到 "Environment Variables"
4. 添加以下变量：

```
DASHSCOPE_API_KEY = sk-46f1dfb6d2e646e2bd7f7495a0a794a3
DASHSCOPE_EMBEDDING_MODEL = text-embedding-v4
DASHSCOPE_CHAT_MODEL = qwen-plus
PINECONE_API_KEY = pcsk_2ynQn1_KNJR85fvuXbid9XWBvzNxoP7Los2LT4EaUsinvH8q4dh8bDd4PcGUSMvGa3Aydd
PINECONE_INDEX_NAME = luv-blog
CRON_SECRET =
GITHUB_REPO_URL = https://raw.githubusercontent.com/lvxingjia/luv_blog/main/src/data/articles.js
```

**重要**: 点击 "Save" 后重新部署项目，新变量才会生效

### ✅ 第 3 步：本地开发配置

#### 3.1 创建 `.env.local` 文件（不提交到 Git）

```env
# 本地开发时的 API 基础 URL（可选）
VITE_API_BASE=http://localhost:3000
```

#### 3.2 安装依赖

```bash
npm install
```

### ✅ 第 4 步：推送到 GitHub & 触发部署

```bash
# 推送代码到 GitHub
git add .
git commit -m "feat: add RAG system with DashScope and Pinecone"
git push origin main
```

Vercel 会自动检测到推送，自动构建部署（需要 1-2 分钟）

### ✅ 第 5 步：手动触发索引（重要！）

#### 5.1 获取你的 Vercel 域名

Vercel 部署完成后，会给你一个 URL，格式如:

```
https://xxxx.vercel.app
```

#### 5.2 手动触发索引

使用 curl 命令（替换 `你的域名` 和 `CRON_SECRET`）：

```bash
curl -X POST \
  https://你的域名.vercel.app/api/rag/index-articles \
  -H "Authorization: Bearer 你的CRON_SECRET" \
  -H "Content-Type: application/json"
```

**预期响应**：

```json
{
  "success": true,
  "message": "索引完成: 共 5 篇文章, 25 个文本块成功索引",
  "summary": {
    "articles": 5,
    "totalChunks": 25,
    "indexedChunks": 25,
    "timestamp": "2025-03-25T..."
  }
}
```

#### 5.3 如果索引失败

检查以下几点：

- ✓ 环境变量是否正确配置
- ✓ DASHSCOPE_API_KEY 是否有效
- ✓ PINECONE_API_KEY 是否有效
- ✓ GitHub URL 是否正确（确保 `articles.js` 存在）
- ✓ Pinecone 索引维度是否为 768

**查看日志**：在 Vercel 项目的 "Deployments" 中点击最新部署，查看 "Functions" 日志

### ✅ 第 6 步：设置定时任务（可选但推荐）

使用 [cron-job.org](https://cron-job.org/) 设置定时索引

#### 6.1 在 cron-job.org 创建新任务

1. 访问 https://cron-job.org
2. 点击 "Sign in" 或注册
3. 创建新 Cron Job：

```
URL: https://你的vercel域名.vercel.app/api/rag/index-articles
Request method: POST
Request headers:
  Authorization: Bearer 你的CRON_SECRET
Cron expression: 0 0 * * * (每天 00:00 UTC)
```

#### 6.2 测试

创建后系统会显示"You can test this cron job"，点击测试验证

---

## 🧪 测试搜索功能

### 前端集成

在你的 Vue 页面中使用 RAGSearch 组件：

```vue
<template>
  <div>
    <h1>我的博客</h1>

    <!-- 添加搜索组件 -->
    <RAGSearch />

    <!-- 其他内容... -->
  </div>
</template>

<script setup>
import RAGSearch from '@/components/RAGSearch.vue'
</script>
```

### 本地测试

1. 启动开发服务器：

```bash
npm run dev
```

2. 打开浏览器访问页面
3. 在搜索框输入问题，例如：
   - "我有哪些摄影文章"
   - "告诉我关于原神的内容"
   - "分享的旅行攻略有哪些"

---

## 🔍 故障排查

### 问题 1: 搜索返回 CORS 错误

**症状**: 浏览器控制台显示 CORS 错误

**解决方案**:

- 确保 API 返回了正确的 CORS 头：`Access-Control-Allow-Origin: *`
- 检查 API Base URL（`VITE_API_BASE`）是否正确

### 问题 2: 查询超时

**症状**: 搜索请求一直无响应

**解决方案**:

- 检查 DashScope API Key 是否过期
- 检查网络连接
- 查看 Vercel 函数是否超时（默认 60 秒）

### 问题 3: Pinecone 报错 "index name not found"

**症状**: 错误信息 `index luv-blog not found`

**解决方案**:

- 检查 Pinecone 门户网站是否真的创建了 `luv-blog` 索引
- 确保 `PINECONE_INDEX_NAME` 环境变量正确

### 问题 4: DashScope 报错 "embedding dimension mismatch"

**症状**: Pinecone 存储向量时出错

**解决方案**:

- **这通常是 Pinecone 索引维度错误**
- 确保 Pinecone 索引维度是 **768**（text-embedding-v3 的标准维度）
- 如果已经创建了错误维度的索引，删除重建

### 问题 5: 搜索结果为空

**症状**: 搜索返回空结果

**解决方案**:

1. 检查文章是否已被成功索引
   ```bash
   curl -X POST https://你的vercel域名.vercel.app/api/rag/index-articles \
     -H "Authorization: Bearer 你的CRON_SECRET"
   ```
2. 查看响应中的 `indexedChunks` 是否大于 0
3. 等待 2-3 分钟让 Pinecone 完全同步数据

---

## 📦 各个文件说明

| 文件                            | 说明                               |
| ------------------------------- | ---------------------------------- |
| `/api/articles.js`              | **获取文章列表**（从 GitHub 读取） |
| `/api/rag/search.js`            | **RAG 搜索接口**（主要逻辑）       |
| `/api/rag/index-articles.js`    | **向量化索引**（定时任务调用）     |
| `/src/components/RAGSearch.vue` | **前端搜索组件**                   |
| `vercel.json`                   | **Vercel 配置文件**                |
| `.env.example`                  | **环境变量示例**                   |

---

## 🎯 常见用途

### 场景 1: 新增文章后如何更新索引？

1. 在 `/src/data/articles/` 下创建新文件：`006-new-article.js`
2. 在 `/src/data/articles.js` 中导入并添加到数组
3. 推送到 GitHub
4. 等待定时任务运行（或手动触发）或立即手动触发：

```bash
curl -X POST https://你的vercel域名.vercel.app/api/rag/index-articles \
  -H "Authorization: Bearer 你的CRON_SECRET"
```

### 场景 2: 修改现有文章

1. 修改对应的 JS 文件
2. 推送到 GitHub
3. 手动触发重新索引

### 场景 3: 切换模型（提速或提质）

修改 Vercel 环境变量 `DASHSCOPE_CHAT_MODEL`：

- `qwen-max` - 最强（推荐用于复杂问题）
- `qwen-plus` - 均衡（推荐用于博客）
- `qwen-turbo` - 最快（推荐用于即时回应）

更改后重新部署项目

---

## 📊 成本参考（月度）

假设小博客每月 100 次查询：

| 项                  | 用量       | 成本     |
| ------------------- | ---------- | -------- |
| DashScope Embedding | 50M tokens | **免费** |
| DashScope Chat      | 30M tokens | **免费** |
| Pinecone            | 1M 向量    | **免费** |
| **月总计**          | -          | **¥0**   |

（完全在免费额度内！）

---

**需要帮助？** 查看完整的 RAG 系统方案文档或咨询技术支持
