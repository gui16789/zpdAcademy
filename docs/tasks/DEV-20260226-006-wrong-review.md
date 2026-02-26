# DEV-20260226-006 · 错题复盘与重做模式

## Stage 1 澄清结论
1. 我的理解
- 在题目页增加错题复盘能力：未达标时显示错题详情（正确答案 + 解释）。
- 支持“一键仅重做错题”，减少重复作答成本。
2. 边界确认
- 仍使用本地 mock 题库，不接后端。
- 不做富文本解析，不做图片题型。
3. 依赖检查
- 依赖 DEV-20260226-004 的答题闭环与判题服务。

## Stage 2 设计与任务拆分

### In Scope
- 扩展题目模型字段（解释文本）。
- 增加错题 ID 提取逻辑。
- 题目页未达标时展示错题复盘并支持重做错题。
- 补充错题逻辑测试。

### Out of Scope
- 题目收藏、错题本持久化。
- 多题型解释模板。
- AI 讲解与推荐练习。

### 子任务（每个 <= 2h）
1. Sub-1 基建型：题目解释字段与 mock 数据补齐（预计 45min）
- 文件：`src/types/question.ts`, `src/data/questionBank.ts`
- 依赖：无
- 验收：每题包含 explanation 字段。
- Issue：[#33](https://github.com/gui16789/zpdAcademy/issues/33)
2. Sub-2 功能型：错题提取逻辑（预计 45min）
- 文件：`src/services/question/questionService.ts`
- 依赖：Sub-1
- 验收：可从评估结果提取错题 ID。
- Issue：[#34](https://github.com/gui16789/zpdAcademy/issues/34)
3. Sub-3 集成型：题目页复盘与重做错题（预计 90min）
- 文件：`src/views/Question/QuestionPage.tsx`
- 依赖：Sub-2
- 验收：未达标可查看错题解释并仅重做错题。
- Issue：[#35](https://github.com/gui16789/zpdAcademy/issues/35)
4. Sub-4 测试型：错题逻辑测试（预计 45min）
- 文件：`src/services/question/questionService.test.ts`
- 依赖：Sub-2
- 验收：覆盖错题 ID 提取场景。
- Issue：[#36](https://github.com/gui16789/zpdAcademy/issues/36)

## 风险与应对
1. 风险：重做错题模式下状态切换混乱。
- 应对：引入独立的 activeQuestionIds 状态并集中重置答案。
2. 风险：解释文本缺失导致空展示。
- 应对：数据层补齐 explanation，页面兜底默认文案。

## 流水线记录（GitHub）
- 主任务 Issue：[#32](https://github.com/gui16789/zpdAcademy/issues/32)
- 功能分支：`feat/DEV-20260226-006-wrong-review`
- Commit：
  - `a48ce39`（Sub-1）
  - `c870394`（Sub-2）
  - `dc12932`（Sub-3）
  - `65f06b8`（Sub-4）
- Event Log：`docs/events/DEV-20260226-006-event-log.md`
