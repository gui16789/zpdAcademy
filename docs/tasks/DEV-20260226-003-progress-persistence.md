# DEV-20260226-003 · 进度持久化与题目页路由骨架

## Stage 1 澄清结论
1. 我的理解
- 在地图进度闭环基础上，补齐刷新不丢进度能力，并引入题目页路由骨架。
- 地图页只负责导航到学习单元，单元完成动作放到题目页执行。
2. 边界确认
- 持久化仅使用 localStorage（前端 mock 阶段）。
- 题目页只提供骨架与最小交互，不实现真实题库流程。
3. 依赖检查
- 依赖 DEV-20260226-002 的进度状态层和地图交互。

## Stage 2 设计与任务拆分

### In Scope
- 增加进度存储服务（localStorage adapter）。
- 重构 progress store 以支持读写持久化。
- 增加 `/question/:unitId` 路由与题目页骨架。
- 增加存储服务单元测试与回归测试。

### Out of Scope
- 后端同步、用户多端一致性。
- 真正题目渲染与判题逻辑。
- 权限体系与离线冲突处理。

### 子任务（每个 <= 2h）
1. Sub-1 基建型：进度存储服务（预计 45min）
- 文件：`src/services/storage/progressStorage.ts`, `src/config/constants.ts`
- 依赖：无
- 验收：可安全读写进度快照，异常数据降级默认值。
- Issue：[#15](https://github.com/gui16789/zpdAcademy/issues/15)
2. Sub-2 功能型：progress store 持久化改造（预计 60min）
- 文件：`src/store/progressStore.ts`
- 依赖：Sub-1
- 验收：刷新后进度保持，重置后清空存储。
- Issue：[#16](https://github.com/gui16789/zpdAcademy/issues/16)
3. Sub-3 集成型：题目页路由骨架与地图联动（预计 90min）
- 文件：`src/router/AppRouter.tsx`, `src/views/Map/MapPage.tsx`, `src/views/Question/QuestionPage.tsx`
- 依赖：Sub-2
- 验收：地图可进入题目页，题目页可完成单元并返回地图。
- Issue：[#17](https://github.com/gui16789/zpdAcademy/issues/17)
4. Sub-4 测试型：存储与进度回归测试（预计 45min）
- 文件：`src/services/storage/progressStorage.test.ts`
- 依赖：Sub-1
- 验收：空存储、坏数据、正常读写均有测试覆盖。
- Issue：[#18](https://github.com/gui16789/zpdAcademy/issues/18)

## 风险与应对
1. 风险：localStorage 不可用导致状态异常。
- 应对：存储服务内部兜底 try/catch，失败回退默认快照。
2. 风险：路由参数无效导致页面错误。
- 应对：题目页在 unit 不存在时回退 `/map`。

## 流水线记录（GitHub）
- 主任务 Issue：[#14](https://github.com/gui16789/zpdAcademy/issues/14)
- 功能分支：`feat/DEV-20260226-003-progress-persistence`
- Commit：
  - `373245e`（Sub-1, Sub-2）
  - `080802c`（Sub-3）
  - `463d017`（Sub-4）
- PR：[#19](https://github.com/gui16789/zpdAcademy/pull/19)
- Event Log：`docs/events/DEV-20260226-003-event-log.md`
