# SupDance Canvas Codex 插件

这是一个独立的 Codex 插件仓库，包含 SupDance Canvas 插件定义、连接技能和本地 MCP Agent 源码。仓库不包含网站源码或网站部署补丁。

## 适用范围

- 插件名：`supdance-canvas`，版本 `0.1.1`
- 本地 Agent：`@supdance/canvas-agent`，版本 `0.1.1`
- Node.js：18 或更新版本
- 目标网站：`https://canvas.supdance.com/canvas`

Agent 0.1.1 使用站点连接票据协议：网页通过 `POST /events-ticket` 获取一次性 SSE 票据，再连接 `GET /events?ticket=...`。票据有效期为 60 秒；断线后沿用浏览器约 3 秒的重试节奏申请新票据，连续失败时显示离线并保留手动重连。

**网站兼容状态：** Agent 0.1.1 需要网站实现上述票据 API。目前线上网站是否已部署此协议尚未确认，因此此仓库发布的是插件候选版本；部署网站适配前，不要将 Agent 0.1.1 用于当前线上页面。网站源码、补丁和部署文件均由独立的网站仓库管理。

## 安装

先克隆此私有仓库，并在本地安装随仓库提供的 Agent 包：

```bash
git clone https://github.com/Blacklake-Go/supdance-canvas-codex-plugin.git
cd supdance-canvas-codex-plugin
npm install -g ./releases/supdance-canvas-agent-0.1.1.tgz
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

## 安全与连接

- Agent 仅监听 `127.0.0.1:17372`，并限制 SupDance Canvas 网站来源。
- 长期令牌保存在 `~/.supdance-canvas/canvas-agent.json`，目录权限为 `0700`、文件权限为 `0600`。
- 浏览器 API 请求通过请求头发送令牌；令牌不放入 URL。SSE 使用绑定来源和客户端 ID 的一次性短期票据。
- 插件连接验收不代表图像生成、素材保存或积分结算已经验收；本仓库不会触发生成任务。

## 移除

```bash
codex plugin remove supdance-canvas@supdance-local
codex plugin marketplace remove supdance-local
npm uninstall -g @supdance/canvas-agent
```

移除 Agent 数据前，请先备份 `~/.supdance-canvas/` 中需要保留的内容。
