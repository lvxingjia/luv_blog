export default {
  id: 6,
  title: 'Vite 3 + Vue 组件 + 路由定向：从零部署到 GitHub Pages 的全记录',
  excerpt:
    '在这篇文章中，我将分享我如何使用 Vite 3 和 Vue 组件创建一个简单的前端项目，并将其部署到 GitHub Pages 的全过程。无论你是前端新手还是有经验的开发者，这篇文章都将为你提供实用的指导和技巧，帮助你顺利完成部署。',
  date: '2026-03-24',
  category: '技术分享',
  readTime: '10分钟阅读',
  slug: 'web-deploy',
  content: `# 为什么是 Vite 3？

Vue CLI 固然成熟，但 Vite 3 基于原生 ES modules 的冷启动和热更新体验实在过于丝滑。执行 npm create vite@latest 之后，几乎不需要等待，开发服务器就已经跑在了 localhost 上。尤其当项目逐渐复杂时，HMR 依然保持即时响应，这在之前使用 webpack 配置时很难达到这种流畅度。

## 组件与路由的配合

项目结构上，我按照功能拆分了几个核心组件，例如 Header、PostList 和 Footer，并在 views 目录下放置了 HomeView、ArchiveView 等页面级组件。路由部分使用 Vue Router 4，在 router/index.js 中配置了动态导入，让页面组件按需加载。

\`\`\`javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/ArchiveView.vue')
  }
]
\`\`\`

Vue Router 结合 Vite 的 import 语法，构建时会自动进行代码分割，生成独立的 chunk，访问体验明显提升。

## GitHub Pages 部署的坑与 Workflows 配置

部署到 GitHub Pages 时，最大的坑在于单页应用的路由支持。如果直接部署，刷新非根路径的页面时，GitHub Pages 会返回 404，因为它试图去请求对应的 HTML 文件。解决方案有两种：一是改用 hash 模式，二是配置 404.html 回退。我选择了更干净的 history 模式，并借助 vite-plugin-singlefile 插件生成一个 404.html 指向 index.html。

自动部署方面，我编写了一个 GitHub Actions workflow，触发条件设置为 push 到 main 分支时运行。关键步骤包括：

- 用 actions/checkout@v4 拉取代码
- 用 actions/setup-node@v4 配置 Node 18
- 执行 npm ci 安装依赖
- 执行 npm run build 生成 dist 目录
- 用 peaceiris/actions-gh-pages@v3 将 dist 部署到 gh-pages 分支

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
\`\`\`

这里需要特别注意的是，在 Vite 配置中要设置 base 为仓库名，否则资源路径会指向根目录，导致样式和脚本加载失败。

\`\`\`javascript
export default defineConfig({
  base: '/my-repo-name/',
  // ...其他配置
})
\`\`\`

## 几点心得

1. Vite 的预构建机制很智能，依赖预构建完成后，后续启动几乎零等待，对于频繁切换分支调试的场景非常友好。
2. 路由模式选择要结合部署环境。GitHub Pages 如果不做特殊处理，history 模式需要额外配置，hash 模式虽然 URL 带 # 但胜在省心。
3. workflows 中建议使用 GITHUB_TOKEN 而不是个人访问令牌，权限更安全，且 actions-gh-pages 插件对权限处理得很完善。
4. 调试部署问题时，可以先在本地执行 npm run build，然后用 serve -s dist 预览构建后的产物，确保所有资源路径正确再推送，能节省很多 Actions 调试时间。

整个流程跑通之后，后续的迭代就变成了 push 代码 -> Actions 自动构建 -> 页面更新，整个过程不到两分钟。相比早期手动上传 FTP 或打包发给运维的时代，现在的开发体验确实提升了很多。

如果你也在尝试用 Vite 构建 Vue 应用并部署到 GitHub Pages，希望这篇文章能帮你少踩一些坑。技术方案没有绝对的好坏，但一套顺手的工具链确实能让人更专注于代码本身。`,
}
