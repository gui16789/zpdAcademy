# DEV-20260226-005 · 单元成绩记录与地图展示

## Stage 1 澄清结论
1. 我的理解
- 在答题闭环基础上，记录每个单元的成绩信息（最近得分/最高分/尝试次数）。
- 地图页展示单元成绩卡片，便于用户看到学习轨迹。
2. 边界确认
- 成绩仍存储在 localStorage，不接后端。
- 不做排行榜与跨用户对比。
3. 依赖检查
- 依赖 DEV-20260226-004 的题目页答题流程与判题结果。

## Stage 2 设计与任务拆分

### In Scope
- 扩展进度快照结构（含成绩记录）。
- 改造 progress store，支持提交答题结果并更新成绩。
- 地图页显示单元成绩摘要。
- 补充持久化兼容性与状态更新测试。

### Out of Scope
- 服务端成绩同步。
- 图表统计与周/月趋势。
- 复杂激励机制（徽章、等级）。

### 子任务（每个 <= 2h）
1. Sub-1 基建型：成绩模型与快照兼容（预计 45min）
- 文件：`src/types/progress.ts`, `src/services/storage/progressStorage.ts`
- 依赖：无
- 验收：旧快照可兼容新结构。
- Issue：[#27](https://github.com/gui16789/zpdAcademy/issues/27)
2. Sub-2 功能型：progress store 成绩更新能力（预计 60min）
- 文件：`src/store/progressStore.ts`
- 依赖：Sub-1
- 验收：提交答题后 attempts/lastScore/bestScore 更新正确。
- Issue：[#28](https://github.com/gui16789/zpdAcademy/issues/28)
3. Sub-3 集成型：Question/Map 页面联动展示（预计 90min）
- 文件：`src/views/Question/QuestionPage.tsx`, `src/views/Map/MapPage.tsx`
- 依赖：Sub-2
- 验收：提交答题后地图可见成绩信息。
- Issue：[#29](https://github.com/gui16789/zpdAcademy/issues/29)
4. Sub-4 测试型：存储与评分记录回归测试（预计 45min）
- 文件：`src/services/storage/progressStorage.test.ts`
- 依赖：Sub-1
- 验收：测试覆盖空值、坏值、正常值与兼容值。
- Issue：[#30](https://github.com/gui16789/zpdAcademy/issues/30)

## 风险与应对
1. 风险：旧数据结构导致解析失败。
- 应对：normalize 时提供默认值并严格校验字段。
2. 风险：页面和 store 的状态源不一致。
- 应对：QuestionPage 提交后统一走 store action。

## 流水线记录（GitHub）
- 主任务 Issue：[#26](https://github.com/gui16789/zpdAcademy/issues/26)
- 功能分支：`feat/DEV-20260226-005-score-history`
- Event Log：`docs/events/DEV-20260226-005-event-log.md`
