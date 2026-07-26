# 项目架构

## 当前形态

Pulse 是一个客户端交互为主、服务端负责首屏和元数据输出的 Next.js 应用。

- `app/layout.tsx`：页面语言、字体、SEO 和社交分享元数据。
- `app/page.tsx`：新闻数据以及简报、收藏、笔记三块交互。
- `app/globals.css`：设计变量、布局、卡片、抽屉、移动端适配和动效。
- `worker/index.ts`：vinext 在 Cloudflare Worker 环境中的请求入口。
- `vite.config.ts`：本地开发和 Sites 构建配置。

## 状态与持久化

新闻是随版本发布的只读内容。以下用户状态保存在浏览器 `localStorage`：

- `pulse-saved`：收藏的新闻和所属文件夹；
- `pulse-folders`：用户自定义收藏夹；
- `pulse-notes`：个人笔记。

这意味着当前版本无需登录，但数据只存在于当前浏览器。未来迁移到云端时，应保持这些数据结构的兼容性，并提供一次性迁移。

## 可选数据库

`db/`、`drizzle.config.ts` 和 `examples/d1/` 为后续 Cloudflare D1 持久化预留。当前产品主流程不依赖数据库，未配置 D1 时不应调用 `getDb()`。

## 部署边界

- GitHub `origin`：源代码协作和版本历史。
- Sites `sites` remote：OpenAI Sites 的构建和生产发布。
- `.openai/hosting.json`：Sites 项目 ID 及可选资源绑定，必须保留。

## 后续拆分建议

当 `app/page.tsx` 继续增长时，优先拆为：

```text
app/
├── components/
│   ├── news/
│   ├── saved/
│   ├── notes/
│   └── shared/
├── data/
│   └── stories.ts
├── lib/
│   └── storage.ts
└── page.tsx
```

拆分应以功能边界为依据，不为了目录数量而拆分。

