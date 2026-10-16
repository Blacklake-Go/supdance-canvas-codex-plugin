# 兼容性与验收记录

## 版本

| 项目 | 候选要求 | 记录 |
| --- | --- | --- |
| Codex CLI | 支持插件的版本 | 此次在 Codex CLI `0.163.0-alpha.10.2` 上完成隔离本地市场安装检查 |
| Node.js | `>=18` | Agent package 声明 Node 18 最低版本 |
| Codex 插件 | `supdance-canvas@0.1.2` | 独立插件 manifest、技能和 MCP 配置 |
| 本地 Agent | `@supdance/canvas-agent@0.1.2` | 源码位于 `packages/agent/`，版本 tarball 位于 `releases/` |
| 网站协议 | v6，兼容旧 SSE 与票据 API | 票据模式需要 `POST /events-ticket` 与 `GET /events?ticket=...`；当前线上旧版网页可用限域 SSE token 回退 |
| 操作系统 | macOS 已检查 | Windows 和 Linux 的浏览器启动行为尚未核验 |

## 连接边界

0.1.2 兼容当前线上网站 Agent 0.1.0 所使用的 EventSource 协议，并保留一次性 SSE 票据：票据 60 秒过期，并绑定来源与客户端。插件已从仓库本地市场发现并安装到隔离 `CODEX_HOME`；系统 Chrome 当前画布连接到候选 Agent，候选 MCP 返回 `hasCanvas: true`、标题“无限画布 1”、8 个节点。

网站源码、部署补丁、生产部署与回滚材料不属于本插件仓库。连接测试与生图测试分别记录；插件安装或连接成功不代表图像生成、素材存储、历史记录或积分结算已通过全面验收。

插件/MCP 可用性也不代表图像生成、素材存储、历史记录或积分结算已通过生产验收。本仓库安装检查不调用生成工具。
