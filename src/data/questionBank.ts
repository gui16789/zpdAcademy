import type { SingleChoiceQuestion } from '../types/question'

export const QUESTION_BANK: SingleChoiceQuestion[] = [
  {
    id: 'q-0101',
    unitId: 'unit-01',
    prompt: 'React 中用于在组件内保存状态的 Hook 是哪个？',
    options: [
      { id: 'a', label: 'useState' },
      { id: 'b', label: 'useFetch' },
      { id: 'c', label: 'useBuild' },
    ],
    correctOptionId: 'a',
    explanation: 'useState 是 React 官方提供的状态 Hook，组件内状态管理应优先使用它。',
  },
  {
    id: 'q-0102',
    unitId: 'unit-01',
    prompt: 'TypeScript strict 模式的主要价值是什么？',
    options: [
      { id: 'a', label: '减少编译速度' },
      { id: 'b', label: '提前暴露类型错误' },
      { id: 'c', label: '自动生成 UI' },
    ],
    correctOptionId: 'b',
    explanation: 'strict 模式帮助在编译期发现类型风险，降低运行时错误。',
  },
  {
    id: 'q-0201',
    unitId: 'unit-02',
    prompt: 'Zustand 中创建 store 的常用函数是？',
    options: [
      { id: 'a', label: 'create' },
      { id: 'b', label: 'compose' },
      { id: 'c', label: 'memo' },
    ],
    correctOptionId: 'a',
    explanation: 'Zustand 通常通过 create 构建 store，再通过 hook 在组件中读取。',
  },
  {
    id: 'q-0202',
    unitId: 'unit-02',
    prompt: 'React Router v6 中声明路由的组件是？',
    options: [
      { id: 'a', label: 'Switch' },
      { id: 'b', label: 'Routes' },
      { id: 'c', label: 'Navigator' },
    ],
    correctOptionId: 'b',
    explanation: 'v6 使用 Routes + Route，Switch 是早期版本写法。',
  },
  {
    id: 'q-0301',
    unitId: 'unit-03',
    prompt: '下列哪项最符合“单一职责原则”？',
    options: [
      { id: 'a', label: '一个模块只做一件事' },
      { id: 'b', label: '一个函数写满所有逻辑' },
      { id: 'c', label: '所有状态放到全局变量' },
    ],
    correctOptionId: 'a',
    explanation: '单一职责意味着模块变化原因单一，可显著降低耦合。',
  },
  {
    id: 'q-0302',
    unitId: 'unit-03',
    prompt: '前端常量集中管理的主要收益是？',
    options: [
      { id: 'a', label: '提高魔法数字数量' },
      { id: 'b', label: '统一配置并降低维护成本' },
      { id: 'c', label: '绕过类型检查' },
    ],
    correctOptionId: 'b',
    explanation: '配置集中后可一处改动全局生效，并提升可读性。',
  },
  {
    id: 'q-0401',
    unitId: 'unit-04',
    prompt: '以下哪项属于有效的 PR 自检项？',
    options: [
      { id: 'a', label: '不跑测试直接提交' },
      { id: 'b', label: '确认 lint/test/build 全通过' },
      { id: 'c', label: '删除所有类型定义' },
    ],
    correctOptionId: 'b',
    explanation: '标准化自检可显著减少回归风险，是 PR 准入前提。',
  },
  {
    id: 'q-0402',
    unitId: 'unit-04',
    prompt: '当任务范围外改动不可避免时，正确做法是？',
    options: [
      { id: 'a', label: '直接改完再说' },
      { id: 'b', label: '停止并回报，等待范围确认' },
      { id: 'c', label: '先合并到主分支' },
    ],
    correctOptionId: 'b',
    explanation: '范围外改动需要先确认，否则会破坏任务原子性和可追溯性。',
  },
]
