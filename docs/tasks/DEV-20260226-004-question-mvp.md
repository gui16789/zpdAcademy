# DEV-20260226-004 · 题目页答题闭环（Mock）

## Stage 1 澄清结论
1. 我的理解
- 在已有题目页骨架基础上，实现最小答题流程：加载题目、选择答案、提交判分、达标后完成单元。
- 本轮只覆盖单选题，不做多题型扩展。
2. 边界确认
- 题目数据使用本地 mock。
- 不接真实后端与题库管理。
- 不做排行榜、历史错题、动画效果优化。
3. 依赖检查
- 依赖 DEV-20260226-003 的题目页路由与进度持久化能力。

## Stage 2 设计与任务拆分

### In Scope
- 增加题目数据模型和 mock 题库。
- 增加判题服务（计分和达标判定）。
- 重构题目页为可答题流程。
- 为判题核心逻辑增加单元测试。

### Out of Scope
- 后端题库同步。
- 多题型（填空/判断/主观题）。
- 题目分页与防作弊。

### 子任务（每个 <= 2h）
1. Sub-1 基建型：题目模型与 mock 题库（预计 45min）
- 文件：`src/types/question.ts`, `src/data/questionBank.ts`, `src/config/constants.ts`
- 依赖：无
- 验收：每个 unit 可取到题目集合。
- Issue：[#21](https://github.com/gui16789/zpdAcademy/issues/21)
2. Sub-2 功能型：判题服务与得分规则（预计 60min）
- 文件：`src/services/question/questionService.ts`
- 依赖：Sub-1
- 验收：可输出答题结果、正确数、得分、是否达标。
- Issue：[#22](https://github.com/gui16789/zpdAcademy/issues/22)
3. Sub-3 集成型：题目页答题交互（预计 90min）
- 文件：`src/views/Question/QuestionPage.tsx`
- 依赖：Sub-2
- 验收：可作答并提交；达标后完成单元并回地图；未达标可重试。
- Issue：[#23](https://github.com/gui16789/zpdAcademy/issues/23)
4. Sub-4 测试型：判题逻辑测试（预计 45min）
- 文件：`src/services/question/questionService.test.ts`
- 依赖：Sub-2
- 验收：覆盖满分、部分正确、未达标三个场景。
- Issue：[#24](https://github.com/gui16789/zpdAcademy/issues/24)

## 风险与应对
1. 风险：提交前未答完导致状态混乱。
- 应对：提交按钮只在全部题目已选答案时可用。
2. 风险：未来多题型扩展时逻辑耦合。
- 应对：判题逻辑独立在 service，页面只消费结果。

## 流水线记录（GitHub）
- 主任务 Issue：[#20](https://github.com/gui16789/zpdAcademy/issues/20)
- 功能分支：`feat/DEV-20260226-004-question-mvp`
- Event Log：`docs/events/DEV-20260226-004-event-log.md`
