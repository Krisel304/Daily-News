# 贡献与维护指南

## 分支

- `main`：始终保持可构建、可发布。
- `feat/*`：新功能。
- `fix/*`：缺陷修复。
- `docs/*`：仅文档变更。
- `content/*`：每日简报内容更新。

## 提交信息

建议采用简洁的 Conventional Commits：

- `feat: add story folder management`
- `fix: preserve notes after refresh`
- `content: publish AI brief for 2026-07-27`
- `docs: clarify deployment workflow`

## 提交前检查

```bash
npm run lint
npm test
```

不要提交：

- `.env*`、访问令牌或私钥；
- `node_modules/`、构建产物和本地 Wrangler 状态；
- 未核验来源或无法追溯到原始链接的新闻；
- 与当前变更无关的大范围格式化。

## 每日内容更新

1. 只采集指定时间窗口内的候选新闻。
2. 找到原始来源，核验发布日期和关键事实。
3. 按事件去重，不按平台帖子数量计算热度。
4. 更新 `app/page.tsx` 中的数据，保留最近 7 天。
5. 运行 lint、测试和生产构建。
6. 使用 `content:` 提交信息记录当天更新。

完整规则见 `docs/CONTENT_PIPELINE.md`。

