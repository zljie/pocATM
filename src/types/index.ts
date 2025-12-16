// 系统和模块
export interface SystemModule {
  id: string;
  name: string;
  testCaseCount: number;
  parentId?: string;
  children?: SystemModule[];
}

// 功能提测
export interface FunctionSubmission {
  id: string;
  functionId: string;
  systemName: string;
  moduleName: string;
  description: string;
  acceptanceCriteria: string;
  usageProcess: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  aiAnalysis?: AIAnalysis;
}

// 测试用例
export interface TestCase {
  id: string;
  functionId: string;
  testCaseId: string;
  description: string;
  steps: string[];
  expectedResult: string;
  priority: 'high' | 'medium' | 'low';
  status: 'draft' | 'active' | 'deprecated';
  executionCount: number;
  lastExecutionResult?: 'pass' | 'fail' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  aiGenerated?: boolean;
  templateId?: string;
}

// 测试报告
export interface TestReport {
  id: string;
  name: string;
  systemName: string;
  moduleName: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  passRate: number;
  executionDate: Date;
  status: 'completed' | 'in-progress' | 'failed';
  summary: string;
  defects: Defect[];
}

// 缺陷
export interface Defect {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: string;
  description: string;
  testCaseId?: string;
  createdAt: Date;
}

// 模板
export interface TestTemplate {
  id: string;
  name: string;
  category: 'functional' | 'performance' | 'security' | 'api';
  description: string;
  steps: TemplateStep[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateStep {
  id: string;
  stepNumber: number;
  description: string;
  expectedResult: string;
  preconditions?: string[];
}

// AI分析结果
export interface AIAnalysis {
  completeness: number; // 0-100
  clarity: number; // 0-100
  suggestions: string[];
  testScenarios: string[];
  potentialIssues: string[];
  confidence: number; // 0-100
}

// AI生成结果
export interface AIGenerationResult {
  testCases: Partial<TestCase>[];
  confidence: number;
  processingTime: number;
  suggestions: string[];
}

// 搜索和筛选
export interface SearchFilters {
  systemName?: string;
  moduleName?: string;
  keyword?: string;
  status?: string;
  priority?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// 导航菜单
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  count?: number;
}

// 表格列定义
export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

// 表单字段
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  validation?: any;
}