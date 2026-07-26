# Pulse — Daily AI News

Pulse 是一款面向 AI 产品从业者的每日情报应用。它把分散在官方博客、技术文档、论文和可信一手来源中的更新，整理成可快速阅读、收藏和记录的每日简报。

## 核心功能

- **今日简报**：按日期浏览 AI 新闻，支持关键词与主题筛选。
- **快速理解**：每条新闻包含重要度、来源、一句话结论、30 秒摘要和产品视角解读。
- **收藏夹**：收藏新闻，并按“必读”“稍后阅读”“产品灵感”或自定义文件夹整理。
- **笔记**：创建、编辑和删除个人笔记，内容自动保存在当前设备。
- **历史归档**：保留最近日期的简报，最新一期默认置顶。
- **响应式界面**：桌面端侧栏与移动端底部导航，适配不同屏幕。

## 技术栈

- React 19
- Next.js 16 App Router
- TypeScript
- vinext + Vite
- Cloudflare Workers / OpenAI Sites
- 浏览器 `localStorage`（收藏与笔记）

## 快速开始

环境要求：Node.js `>= 22.13.0`。

```bash
git clone git@github.com:Krisel304/Daily-News.git
cd Daily-News
npm install
npm run dev
```

本地开发服务启动后，按照终端提示访问页面。

## 常用命令

```bash
npm run dev       # 启动本地开发环境
npm run lint      # 运行代码规范检查
npm run build     # 生成生产构建
npm test          # 构建并运行项目测试
npm run db:generate # 数据库结构变更后生成 Drizzle migration
```

## 项目结构

```text
Daily-News/
├── app/                    # 页面、全局样式与应用级组件逻辑
│   ├── globals.css         # 视觉系统与响应式样式
│   ├── layout.tsx          # 根布局和 SEO 元数据
│   └── page.tsx            # 简报、收藏和笔记主应用
├── build/                  # Sites / vinext 构建适配
├── db/                     # Drizzle 数据访问与 schema
├── docs/                   # 架构和内容生产规范
├── examples/               # 可选 D1 接入示例
├── public/                 # 图标和社交分享图片
├── tests/                  # 自动化验收测试
├── worker/                 # Cloudflare Worker 入口
├── .github/workflows/      # GitHub Actions 持续集成
├── .openai/hosting.json    # OpenAI Sites 项目标识与绑定
├── TODO.md                 # 产品路线图
└── package.json            # 依赖与项目命令
```

更完整的技术边界见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，新闻筛选与摘要标准见 [docs/CONTENT_PIPELINE.md](docs/CONTENT_PIPELINE.md)。

## 数据与隐私

- 当前新闻内容随代码版本发布。
- 收藏夹、收藏记录和笔记保存在浏览器本地，不会自动上传。
- 清除浏览器站点数据会删除本地收藏和笔记。
- 后续如接入账号与云同步，需要先完成隐私策略、鉴权和数据迁移设计。

## 内容更新原则

Pulse 以事件为单位去重，并优先选择官方公告、论文和产品文档。重要度综合考虑行业影响、产品相关性、新颖度与来源可信度。任何自动采集内容都应在发布前校验时间、链接和关键事实。

## Git 工作流

```bash
git checkout -b feat/your-feature
git add .
git commit -m "feat: describe the change"
git push -u origin feat/your-feature
```

推荐使用小而清晰的提交。提交前至少运行：

```bash
npm run lint
npm test
```

详细约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 部署

项目当前关联 OpenAI Sites，配置位于 `.openai/hosting.json`。`sites` Git remote 用于 Sites 版本发布，`origin` 指向 GitHub，二者用途不同，请勿删除 Sites 配置。

公开站点若使用自定义域名，需要在 Sites 中绑定域名并按平台提供的记录配置 DNS。

## Roadmap

计划中的实时 RSS / 官方 API、云端收藏与笔记同步等工作记录在 [TODO.md](TODO.md)。
