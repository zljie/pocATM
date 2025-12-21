import { SystemModule, FunctionSubmission, TestCase, TestReport, TestTemplate, AIAnalysis, Requirement, TestPlan, BurndownPoint } from '../types';

// 系统模块数据
export const systemModules: SystemModule[] = [
  {
    id: '1',
    name: '采购系统',
    testCaseCount: 45,
    children: [
      {
        id: '1-1',
        name: '供应商管理',
        testCaseCount: 12,
        parentId: '1'
      },
      {
        id: '1-2',
        name: '采购订单',
        testCaseCount: 18,
        parentId: '1'
      },
      {
        id: '1-3',
        name: '库存管理',
        testCaseCount: 15,
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    name: '订单系统',
    testCaseCount: 32,
    children: [
      {
        id: '2-1',
        name: '订单创建',
        testCaseCount: 10,
        parentId: '2'
      },
      {
        id: '2-2',
        name: '订单修改',
        testCaseCount: 8,
        parentId: '2'
      },
      {
        id: '2-3',
        name: '订单查询',
        testCaseCount: 14,
        parentId: '2'
      }
    ]
  },
  {
    id: '3',
    name: '支付系统',
    testCaseCount: 28,
    children: [
      {
        id: '3-1',
        name: '在线支付',
        testCaseCount: 15,
        parentId: '3'
      },
      {
        id: '3-2',
        name: '退款处理',
        testCaseCount: 13,
        parentId: '3'
      }
    ]
  }
];

// AI分析模拟
const mockAIAnalysis: AIAnalysis = {
  completeness: 85,
  clarity: 90,
  suggestions: [
    '建议补充异常情况处理说明',
    '可以添加具体的业务场景示例',
    '建议明确性能要求'
  ],
  testScenarios: [
    '正常业务流程验证',
    '边界条件测试',
    '异常情况处理',
    '权限验证测试'
  ],
  potentialIssues: [
    '未明确错误处理机制',
    '缺乏数据验证规则',
    '界面响应时间要求不明确'
  ],
  confidence: 88
};

// 功能提测数据
export const functionSubmissions: FunctionSubmission[] = [
  {
    id: '1',
    functionId: 'FUNC-001',
    systemName: '采购系统',
    moduleName: '供应商管理',
    description: '供应商注册功能，支持企业供应商的基本信息录入、资质文件上传和审核流程管理。',
    acceptanceCriteria: '1. 供应商能够成功提交注册申请；2. 系统能够自动验证必填信息；3. 审核流程能够正常流转；4. 支持多种文件格式上传；5. 审核结果能够及时通知申请人。',
    usageProcess: '1. 供应商访问注册页面；2. 填写基本信息和企业资质；3. 上传相关证明文件；4. 提交注册申请；5. 等待审核结果；6. 根据审核反馈进行修改或完成注册。',
    status: 'pending',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-12'),
    aiAnalysis: mockAIAnalysis
  },
  {
    id: '2',
    functionId: 'FUNC-002',
    systemName: '订单系统',
    moduleName: '订单创建',
    description: '客户创建订单功能，支持多种商品类型、促销活动应用和订单金额计算。',
    acceptanceCriteria: '1. 支持多种商品类型下单；2. 能够正确计算订单总价；3. 促销活动能够正确应用；4. 库存不足时能够正确提示；5. 订单信息能够准确保存。',
    usageProcess: '1. 客户浏览商品并添加到购物车；2. 进入购物车确认商品和数量；3. 选择收货地址和支付方式；4. 应用优惠券或促销活动；5. 确认订单信息并提交；6. 系统生成订单号并跳转支付页面。',
    status: 'approved',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-14'),
    aiAnalysis: {
      ...mockAIAnalysis,
      completeness: 92,
      clarity: 88,
      confidence: 91
    }
  },
  {
    id: '3',
    functionId: 'FUNC-003',
    systemName: '支付系统',
    moduleName: '在线支付',
    description: '在线支付功能，支持支付宝、微信支付、银行卡等多种支付方式。',
    acceptanceCriteria: '1. 支持多种支付方式；2. 支付过程安全可靠；3. 支付结果能够及时反馈；4. 异常支付能够正确处理；5. 支付数据能够准确记录。',
    usageProcess: '1. 选择支付方式；2. 输入支付信息；3. 确认支付金额；4. 跳转第三方支付平台；5. 完成支付或取消支付；6. 返回支付结果页面。',
    status: 'pending',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-13')
  },
  {
    id: '4',
    functionId: 'FUNC-004',
    systemName: '采购系统',
    moduleName: '库存管理',
    description: '库存管理功能，支持库存查询、入库出库操作和库存预警。',
    acceptanceCriteria: '1. 实时查询库存信息；2. 支持批量入库出库操作；3. 库存预警能够及时提醒；4. 库存数据准确无误；5. 支持库存调拨功能。',
    usageProcess: '1. 进入库存管理页面；2. 选择要操作的商品；3. 执行入库或出库操作；4. 确认操作数量和原因；5. 系统更新库存数据；6. 发送操作通知。',
    status: 'rejected',
    createdAt: new Date('2024-12-09'),
    updatedAt: new Date('2024-12-11')
  }
];

// 测试用例数据
export const testCases: TestCase[] = [
  {
    id: '1',
    functionId: 'FUNC-001',
    testCaseId: 'TC-001-01',
    description: '供应商注册-正常流程',
    steps: [
      '打开供应商注册页面',
      '填写企业基本信息',
      '上传企业资质文件',
      '提交注册申请',
      '查看审核状态'
    ],
    expectedResult: '注册申请成功提交，状态显示为待审核',
    priority: 'high',
    status: 'active',
    executionCount: 3,
    lastExecutionResult: 'pass',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
    aiGenerated: true
  },
  {
    id: '2',
    functionId: 'FUNC-001',
    testCaseId: 'TC-001-02',
    description: '供应商注册-必填字段验证',
    steps: [
      '打开供应商注册页面',
      '不填写企业名称',
      '尝试提交注册申请',
      '查看验证提示'
    ],
    expectedResult: '系统提示企业名称为必填项，无法提交',
    priority: 'high',
    status: 'active',
    executionCount: 2,
    lastExecutionResult: 'pass',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12')
  },
  {
    id: '3',
    functionId: 'FUNC-002',
    testCaseId: 'TC-002-01',
    description: '订单创建-正常下单流程',
    steps: [
      '登录用户账号',
      '浏览商品列表',
      '选择商品并加入购物车',
      '进入购物车页面',
      '选择收货地址',
      '选择支付方式',
      '确认订单并提交'
    ],
    expectedResult: '订单创建成功，生成订单号，跳转支付页面',
    priority: 'high',
    status: 'active',
    executionCount: 5,
    lastExecutionResult: 'pass',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
    aiGenerated: true
  },
  {
    id: '4',
    functionId: 'FUNC-002',
    testCaseId: 'TC-002-02',
    description: '订单创建-库存不足处理',
    steps: [
      '选择库存不足的商品',
      '尝试添加到购物车',
      '输入购买数量',
      '查看系统提示'
    ],
    expectedResult: '系统提示库存不足，无法添加或限制购买数量',
    priority: 'medium',
    status: 'active',
    executionCount: 1,
    lastExecutionResult: 'fail',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14')
  }
];

// 测试报告数据
export const testReports: TestReport[] = [
  {
    id: '1',
    name: '供应商管理模块测试报告',
    systemName: '采购系统',
    moduleName: '供应商管理',
    totalCases: 12,
    passedCases: 10,
    failedCases: 2,
    passRate: 83.3,
    executionDate: new Date('2024-12-15'),
    status: 'completed',
    summary: '供应商管理模块基本功能正常，发现2个缺陷需要修复',
    defects: [
      {
        id: 'DEF-001',
        title: '文件上传大小限制不明确',
        severity: 'medium',
        status: 'open',
        assignee: '张三',
        description: '上传文件超过5MB时没有明确提示',
        testCaseId: 'TC-001-03',
        createdAt: new Date('2024-12-15')
      },
      {
        id: 'DEF-002',
        title: '审核状态显示延迟',
        severity: 'low',
        status: 'in-progress',
        assignee: '李四',
        description: '审核状态更新存在1-2分钟延迟',
        testCaseId: 'TC-001-01',
        createdAt: new Date('2024-12-15')
      }
    ]
  },
  {
    id: '2',
    name: '订单创建功能测试报告',
    systemName: '订单系统',
    moduleName: '订单创建',
    totalCases: 8,
    passedCases: 7,
    failedCases: 1,
    passRate: 87.5,
    executionDate: new Date('2024-12-14'),
    status: 'completed',
    summary: '订单创建功能基本满足需求，库存验证逻辑需要优化',
    defects: [
      {
        id: 'DEF-003',
        title: '库存验证延迟',
        severity: 'high',
        status: 'open',
        assignee: '王五',
        description: '高并发情况下库存验证存在延迟',
        testCaseId: 'TC-002-02',
        createdAt: new Date('2024-12-14')
      }
    ]
  }
];

// 需求数据
export const requirements: Requirement[] = [
  {
    id: 'REQ-001',
    title: '供应商信息管理功能',
    description: '系统需要支持供应商基本信息的录入、修改、查询和删除功能，包括供应商名称、联系方式、资质证书等信息的维护。',
    system: '采购系统',
    module: '供应商管理',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'REQ-002',
    title: '采购订单审批流程',
    description: '采购订单需要支持多级审批流程，包括部门审批、财务审批等，支持审批意见的记录和审批历史的查看。',
    system: '采购系统',
    module: '采购订单',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11')
  },
  {
    id: 'REQ-003',
    title: '库存预警机制',
    description: '当库存低于设定阈值时，系统应该自动发送预警通知，支持多种预警方式（邮件、短信、系统内通知）。',
    system: '采购系统',
    module: '库存管理',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12')
  },
  {
    id: 'REQ-004',
    title: '订单状态实时追踪',
    description: '用户能够实时查看订单的处理状态，包括订单创建、支付确认、物流配送等各个阶段的详细信息。',
    system: '订单系统',
    module: '订单查询',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-13')
  },
  {
    id: 'REQ-005',
    title: '移动端支付适配',
    description: '支付系统需要适配各种移动端支付方式，包括微信支付、支付宝、银行卡快捷支付等。',
    system: '支付系统',
    module: '在线支付',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14')
  },
  {
    id: 'REQ-006',
    title: '退款自动处理',
    description: '支持部分退款和全额退款，支持原路退款和手动退款，退款处理过程需要详细记录。',
    system: '支付系统',
    module: '退款处理',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  }
];

// 燃尽图数据
const generateBurndownData = (startDate: Date, endDate: Date, totalWorkload: number): BurndownPoint[] => {
  const data: BurndownPoint[] = [];
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    const plannedWorkload = totalWorkload * (1 - i / days);
    const completedWorkload = i < days ? totalWorkload * 0.1 + (totalWorkload * 0.8 * i / days) : totalWorkload;
    const actualWorkload = completedWorkload * 0.95; // 稍微落后于计划
    const remainingWorkload = totalWorkload - actualWorkload;
    
    data.push({
      date: currentDate,
      plannedWorkload,
      actualWorkload,
      completedWorkload,
      remainingWorkload
    });
  }
  
  return data;
};

// 测试计划数据
export const testPlans: TestPlan[] = [
  {
    id: 'PLAN-001',
    name: '供应商管理模块测试计划',
    description: '对采购系统供应商管理功能进行全面测试，包括功能测试、性能测试和用户体验测试。',
    status: 'in_progress',
    startDate: new Date('2024-12-16'),
    endDate: new Date('2024-12-23'),
    assignedTo: ['张三', '李四', '王五'],
    requirements: ['REQ-001'],
    testCases: [
      {
        testCaseId: 'TC-001-01',
        priority: 'high',
        expectedExecutionTime: 2,
        actualExecutionTime: 2.5,
        status: 'completed',
        assignee: '张三'
      },
      {
        testCaseId: 'TC-001-02',
        priority: 'high',
        expectedExecutionTime: 1.5,
        actualExecutionTime: 1.8,
        status: 'completed',
        assignee: '张三'
      },
      {
        testCaseId: 'TC-001-03',
        priority: 'medium',
        expectedExecutionTime: 1,
        actualExecutionTime: 1.2,
        status: 'in_progress',
        assignee: '李四'
      },
      {
        testCaseId: 'TC-001-04',
        priority: 'medium',
        expectedExecutionTime: 2,
        status: 'planned',
        assignee: '王五'
      }
    ],
    progress: 65,
    burndownData: generateBurndownData(new Date('2024-12-16'), new Date('2024-12-23'), 6.5),
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: 'PLAN-002',
    name: '订单系统功能测试计划',
    description: '订单创建、修改、查询等核心功能的测试计划，重点关注业务逻辑和异常处理。',
    status: 'draft',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-27'),
    assignedTo: ['赵六', '孙七'],
    requirements: ['REQ-004'],
    testCases: [
      {
        testCaseId: 'TC-002-01',
        priority: 'high',
        expectedExecutionTime: 3,
        status: 'planned',
        assignee: '赵六'
      },
      {
        testCaseId: 'TC-002-02',
        priority: 'high',
        expectedExecutionTime: 2.5,
        status: 'planned',
        assignee: '赵六'
      },
      {
        testCaseId: 'TC-002-03',
        priority: 'medium',
        expectedExecutionTime: 2,
        status: 'planned',
        assignee: '孙七'
      }
    ],
    progress: 0,
    burndownData: generateBurndownData(new Date('2024-12-20'), new Date('2024-12-27'), 7.5),
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: 'PLAN-003',
    name: '支付系统安全测试计划',
    description: '对支付系统的安全性进行全面测试，包括支付加密、数据安全、权限控制等。',
    status: 'completed',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-15'),
    assignedTo: ['周八', '吴九'],
    requirements: ['REQ-005', 'REQ-006'],
    testCases: [
      {
        testCaseId: 'TC-003-01',
        priority: 'high',
        expectedExecutionTime: 4,
        actualExecutionTime: 4.5,
        status: 'completed',
        assignee: '周八'
      },
      {
        testCaseId: 'TC-003-02',
        priority: 'high',
        expectedExecutionTime: 3,
        actualExecutionTime: 3.2,
        status: 'completed',
        assignee: '周八'
      },
      {
        testCaseId: 'TC-003-03',
        priority: 'medium',
        expectedExecutionTime: 2.5,
        actualExecutionTime: 2.8,
        status: 'completed',
        assignee: '吴九'
      }
    ],
    progress: 100,
    burndownData: generateBurndownData(new Date('2024-12-10'), new Date('2024-12-15'), 9.5),
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-15')
  }
];

// 模板数据
export const testTemplates: TestTemplate[] = [
  {
    id: '1',
    name: '功能测试标准模板',
    category: 'functional',
    description: '标准功能测试用例模板，适用于大部分功能验证',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        description: '打开功能页面',
        expectedResult: '页面正常加载',
        preconditions: ['用户已登录', '网络连接正常']
      },
      {
        id: 'step-2',
        stepNumber: 2,
        description: '执行主要操作',
        expectedResult: '操作成功执行',
        preconditions: []
      },
      {
        id: 'step-3',
        stepNumber: 3,
        description: '验证操作结果',
        expectedResult: '结果符合预期',
        preconditions: []
      }
    ],
    tags: ['标准', '功能测试', 'UI'],
    isPublic: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'API接口测试模板',
    category: 'api',
    description: 'API接口测试专用模板，包含请求验证和响应检查',
    steps: [
      {
        id: 'step-api-1',
        stepNumber: 1,
        description: '构造API请求',
        expectedResult: '请求参数正确',
        preconditions: ['API服务正常', '认证信息有效']
      },
      {
        id: 'step-api-2',
        stepNumber: 2,
        description: '发送API请求',
        expectedResult: '收到响应结果',
        preconditions: []
      },
      {
        id: 'step-api-3',
        stepNumber: 3,
        description: '验证响应状态码',
        expectedResult: '状态码为200',
        preconditions: []
      },
      {
        id: 'step-api-4',
        stepNumber: 4,
        description: '验证响应数据格式',
        expectedResult: '数据格式正确',
        preconditions: []
      }
    ],
    tags: ['API', '接口测试', '后端'],
    isPublic: true,
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '3',
    name: '性能测试模板',
    category: 'performance',
    description: '性能测试专用模板，关注响应时间和系统负载',
    steps: [
      {
        id: 'step-perf-1',
        stepNumber: 1,
        description: '准备测试环境',
        expectedResult: '环境配置完成',
        preconditions: ['测试环境就绪', '监控工具已部署']
      },
      {
        id: 'step-perf-2',
        stepNumber: 2,
        description: '执行性能测试',
        expectedResult: '测试正常运行',
        preconditions: ['负载测试工具已配置']
      },
      {
        id: 'step-perf-3',
        stepNumber: 3,
        description: '监控性能指标',
        expectedResult: '收集性能数据',
        preconditions: ['监控系统正常运行']
      },
      {
        id: 'step-perf-4',
        stepNumber: 4,
        description: '分析性能结果',
        expectedResult: '性能指标符合要求',
        preconditions: ['性能基准已定义']
      }
    ],
    tags: ['性能', '负载测试', '监控'],
    isPublic: false,
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-03')
  }
];