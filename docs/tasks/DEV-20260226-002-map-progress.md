# DEV-20260226-002 · 地图页进度闭环（Mock）

## Stage 1 澄清结论
1. 我的理解
- 在已完成登录闭环基础上，补全 `/map` 页面最小可用学习进度体验。
- 用户进入地图后可看到单元列表、当前可学习单元、已完成单元与锁定单元状态。
2. 边界确认
- 仅做前端 mock，不对接后端。
- 不实现题目详情页，不实现持久化同步。
3. 依赖检查
- 依赖 DEV-20260226-001 已完成的登录态和路由骨架。

## Stage 2 设计与任务拆分

### In Scope
- 增加地图单元数据模型与常量。
- 增加学习进度 Store 与状态选择逻辑。
- 重构 Map 页面为可交互单元网格。
- 为核心进度逻辑补单元测试。

### Out of Scope
- 后端进度同步。
- 课程详情/题目页面。
- 数据持久化（localStorage/supabase）。

### 子任务（每个 <= 2h）
1. Sub-1 基建型：单元数据与类型定义（预计 45min）
- 文件：`src/types/progress.ts`, `src/config/constants.ts`
- 依赖：无
- 验收：单元清单和状态枚举可复用。
- Issue：[#9](https://github.com/gui16789/zpdAcademy/issues/9)
2. Sub-2 功能型：进度 Store 与状态选择器（预计 60min）
- 文件：`src/store/progressStore.ts`, `src/features/progress/selectors.ts`
- 依赖：Sub-1
- 验收：可计算 completed/unlocked/locked 三种状态。
- Issue：[#10](https://github.com/gui16789/zpdAcademy/issues/10)
3. Sub-3 集成型：Map 页面交互重构（预计 90min）
- 文件：`src/views/Map/MapPage.tsx`
- 依赖：Sub-2
- 验收：可触发“开始学习/复习”，完成后自动解锁下一单元。
- Issue：[#11](https://github.com/gui16789/zpdAcademy/issues/11)
4. Sub-4 测试型：进度逻辑单元测试（预计 45min）
- 文件：`src/features/progress/selectors.test.ts`
- 依赖：Sub-2
- 验收：状态计算测试覆盖关键路径。
- Issue：[#12](https://github.com/gui16789/zpdAcademy/issues/12)

## 风险与应对
1. 风险：后续接后端时状态来源变化。
- 应对：通过 selector + store 边界隔离 UI 与数据源。
2. 风险：无持久化导致刷新丢失进度。
- 应对：在文档中明确为已知 P1 技术债，后续任务偿还。

## 流水线记录（GitHub）
- 主任务 Issue：[#8](https://github.com/gui16789/zpdAcademy/issues/8)
- 功能分支：`feat/DEV-20260226-002-map-progress`
- Event Log：`docs/events/DEV-20260226-002-event-log.md`
