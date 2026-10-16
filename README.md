# SupDance Canvas Codex 插件

这是一个独立的 Codex 插件仓库，包含 SupDance Canvas 插件定义、连接技能和本地 MCP Agent 源码。仓库不包含网站源码或网站部署补丁。

## 适用范围

- 插件名：`supdance-canvas`，版本 `0.1.4`
- 本地 Agent：`@supdance/canvas-agent`，版本 `0.1.3`
- Node.js：18 或更新版本
- 目标网站：`https://canvas.supdance.com/canvas`

Agent 0.1.3 提供一次性票据 SSE 模式：配套网站前端升级后，可通过 `POST /events-ticket` 获取票据，再连接 `GET /events?ticket=...`。票据有效期为 60 秒；网站前端断线后应沿用浏览器约 3 秒的重试节奏重新申请票据，并在连续失败时显示离线、保留手动重连。当前线上页面仍使用旧 SSE 协议，因此 Agent 0.1.3 保留受限兼容入口：只有已配置的 SupDance Canvas 来源可在 `/events` SSE 查询中携带 token；其他 API 不接受 URL token。网站前端改造不包含在此仓库。

**网站兼容状态：** Agent 0.1.3 可连接当前线上旧协议，也支持网站升级后采用一次性票据。Agent 从本机 PATH 调用已安装的 Codex CLI（可用 `CODEX_CLI_PATH` 指定），不再在插件包内重复携带 300 MB 级的 Codex 可执行文件。网站源码、补丁和部署文件均由独立的网站仓库管理。

## 安装

先克隆此 GitHub 仓库，并在本地安装随仓库提供的 Agent 包：

```bash
git clone https://github.com/Blacklake-Go/supdance-canvas-codex-plugin.git
cd supdance-canvas-codex-plugin
npm install -g ./releases/supdance-canvas-agent-0.1.3.tgz
```

再将仓库作为 Codex 插件市场并安装插件：

```bash
codex plugin marketplace add Blacklake-Go/supdance-canvas-codex-plugin --ref main
codex plugin add supdance-canvas@supdance-local
```

安装后开启新的 Codex 对话，使用“打开 SupDance 画布”启动连接流程。若需要从源码构建 Agent：

```bash
cd packages/agent
npm ci
npm test
npm run build
npm pack
```

## OpenAI 官方目录包

`releases/supdance-canvas-official-submission-0.1.4.zip` 是包含本地 Agent、运行依赖、官方 `mcp.json`、技能和 SupDance 图标的独立提交包。Agent 通过 `PATH` 中的 Codex CLI 启动 app-server；可用 `CODEX_CLI_PATH` 指定 CLI 路径。

此版本面向官方目录的 Desktop-only 本地 MCP 流程。OpenAI 仅接受获准合作伙伴提交本地 MCP，提交组织必须先由 OpenAI 代表加入 allowlist，并完成开发者身份验证。该 ZIP 是待提交包，不代表已经通过审核或上架。

## 安全与连接

- Agent 仅监听 `127.0.0.1:17372`，并限制 SupDance Canvas 网站来源。
- 长期令牌保存在 `~/.supdance-canvas/canvas-agent.json`，目录权限为 `0700`、文件权限为 `0600`。
- 浏览器 API 请求通过请求头发送令牌。SSE 优先使用绑定来源和客户端 ID 的一次性短期票据；当前旧版网站兼容期间，只有 SSE 路由允许指定网站来源使用查询令牌。
- `autoRun=true` 的创建流程调用已经启动生成；不要紧接着对同一配置节点调用 `canvas_run_generation`。优先按原任务 ID 查询状态，避免重复付费。
- 插件连接验收不代表图像生成、素材保存或积分结算已经验收；本仓库不会触发生成任务。

## 移除

```bash
codex plugin remove supdance-canvas@supdance-local
codex plugin marketplace remove supdance-local
npm uninstall -g @supdance/canvas-agent
```

移除 Agent 数据前，请先备份 `~/.supdance-canvas/` 中需要保留的内容。
