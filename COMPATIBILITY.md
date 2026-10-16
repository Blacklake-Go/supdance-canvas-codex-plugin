# 兼容性与验收记录

## 版本

| 项目 | 候选要求 | 记录 |
| --- | --- | --- |
| Codex CLI | 支持插件的版本 | 此次在 Codex CLI `0.163.0-alpha.10.2` 上从 GitHub 市场发现并安装 |
| Node.js | `>=18` | Agent package 声明 Node 18 最低版本 |
| Codex 插件 | `supdance-canvas@0.1.4` | 独立插件 manifest、技能和 MCP 配置；附带 SupDance 徽标 |
| 本地 Agent | `@supdance/canvas-agent@0.1.3` | 源码位于 `packages/agent/`，版本 tarball 位于 `releases/`；使用本机 Codex CLI |
| 官方目录包 | `supdance-canvas-official-submission-0.1.4.zip` | 包含本地 Agent、生产依赖和 stdio MCP 配置；MCP 握手与工具清单已检查；尚未提交审核 |
| 网站协议 | v6，兼容旧 SSE 与票据 API | 票据模式需要 `POST /events-ticket` 与 `GET /events?ticket=...`；当前线上旧版网页可用限域 SSE token 回退 |
| 操作系统 | macOS 已检查 | Windows 和 Linux 的浏览器启动行为尚未核验 |

## 连接边界

Agent 0.1.2 的历史验收兼容当前线上网站 Agent 0.1.0 使用的 EventSource 协议，也保留一次性 SSE 票据：票据 60 秒过期，并绑定来源与客户端。插件已从公开 GitHub 仓库市场发现并安装到隔离 `CODEX_HOME`；系统 Chrome 当前画布曾连接到候选 Agent，候选 MCP 返回 `hasCanvas: true`、标题“无限画布 1”、8 个节点。Agent 0.1.3 移除了捆绑 Codex CLI 的依赖，改用本机 Codex CLI；该版本构建及 133 项测试通过，实际画布连接仍待重新验收。

网站源码、部署补丁、生产部署与回滚材料不属于本插件仓库。连接测试与生图测试分别记录；插件安装或连接成功不代表图像生成、素材存储、历史记录或积分结算已通过全面验收。

官方目录准入还要求 OpenAI 确认本地 MCP 提交资格并将组织加入 allowlist，且完成开发者身份验证。当前官方 ZIP 的 MCP 握手可列出工具，但尚未在干净桌面安装环境完成真实网页连接验收。

插件/MCP 可用性也不代表图像生成、素材存储、历史记录或积分结算已通过生产验收。本仓库安装检查不调用生成工具。
