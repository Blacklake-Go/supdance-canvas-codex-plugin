---
name: canvas
description: 读取和操作 SupDance 当前网页画布，包括节点、选区、提示词和生成流程。
---

# SupDance 画布

- 若网页未连接，先按 `open-canvas` 技能启动并连接。
- 操作前使用 `supdance-canvas` MCP 的 `canvas_get_state` 读取当前画布；提及选中内容时先读取 `canvas_get_selection`。
- 只创建或配置流程时保持 `autoRun=false`。用户明确要求生成时，创建流程可用 `autoRun=true`，这次调用本身已经启动一次生成；不要再对返回的配置节点调用 `canvas_run_generation`。
- 若使用 `autoRun=false`，先读取流程结果，再调用一次 `canvas_run_generation`。提交后用 `generation_get_status` 查询原任务；任务仍在运行时不要重新提交，也不要用新任务替代超时查询。
- 生成前先确认当前模型、数量和费用；实际生成结果和费用应以网站任务记录为准。
- 创建文本优先使用 `canvas_create_text_node`；批量节点和连线使用 `canvas_apply_ops`。
- 不要求用户复制 JSON、Local URL 或 Connect token；不把本地连接成功说成网站付费生成已验证。
