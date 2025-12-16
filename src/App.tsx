import { useState, useEffect } from 'react'
import { Card } from './components/ui/card'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { DialogContent as AlertDialogContent, DialogHeader as AlertDialogHeader, DialogTitle as AlertDialogTitle } from './components/ui/dialog'
import { Home, FileText, Users, Search, ChevronDown, ChevronRight, Plus, Settings, BarChart3, Brain, Menu, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { cn } from './lib/utils'
import { systemModules, functionSubmissions, testCases, testReports } from './data/mockData'
import { FunctionSubmissionForm } from './components/FunctionSubmissionForm'
import { TestCaseGenerator } from './components/TestCaseGenerator'
import { TemplateManager } from './components/TemplateManager'
import { TestReportDetail } from './components/TestReportDetail'
import type { SystemModule, FunctionSubmission, TestCase } from './types'

type ActiveView = 'function-submissions' | 'test-cases' | 'test-reports'

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('function-submissions')
  const [selectedModule, setSelectedModule] = useState<string>('全部')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sidebarCollapsed')
        return saved ? JSON.parse(saved) : false
      } catch (error) {
        console.warn('Failed to load sidebar state:', error)
        return false
      }
    }
    return false
  })
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailContent, setDetailContent] = useState<{title: string, content: string}>({title: '', content: ''})
  const [showReportDetail, setShowReportDetail] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string>('')
  const [testCasesState, setTestCasesState] = useState<TestCase[]>(testCases)
  const [showTestCaseDetail, setShowTestCaseDetail] = useState(false)
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null)
  const [showTestCaseEdit, setShowTestCaseEdit] = useState(false)
  const [editValues, setEditValues] = useState<{
    id: string
    description: string
    stepsText: string
    expectedResult: string
    priority: 'high' | 'medium' | 'low'
    status: 'draft' | 'active' | 'deprecated'
    category?: 'normal' | 'exception' | 'boundary' | 'error_handling'
  } | null>(null)
  
  const categoryLabel = (c?: 'normal' | 'exception' | 'boundary' | 'error_handling') => {
    switch (c) {
      case 'normal': return '正常路径测试'
      case 'exception': return '异常路径测试'
      case 'boundary': return '边界条件测试'
      case 'error_handling': return '错误处理测试'
      default: return '未分类'
    }
  }

  const categoryClass = (c?: 'normal' | 'exception' | 'boundary' | 'error_handling') => {
    switch (c) {
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'exception': return 'bg-red-100 text-red-800'
      case 'boundary': return 'bg-yellow-100 text-yellow-800'
      case 'error_handling': return 'bg-purple-100 text-purple-800'
      default: return 'bg-muted text-muted-foreground'
    }
  }
  
  // 模态框状态
  const [showFunctionForm, setShowFunctionForm] = useState(false)
  const [showTestCaseGenerator, setShowTestCaseGenerator] = useState(false)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [selectedFunctionForGeneration, setSelectedFunctionForGeneration] = useState<FunctionSubmission | null>(null)

  // 保存侧边栏状态到localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  // 处理详情模态框
  const handleShowDetail = (title: string, content: string) => {
    setDetailContent({title, content})
    setShowDetailModal(true)
  }

  const navItems = [
    {
      id: 'function-submissions' as ActiveView,
      label: '功能提测清单',
      icon: FileText,
      count: functionSubmissions.length
    },
    {
      id: 'test-cases' as ActiveView,
      label: '测试用例清单',
      icon: Users,
      count: testCasesState.length
    },
    {
      id: 'test-reports' as ActiveView,
      label: '测试报告清单',
      icon: BarChart3,
      count: testReports.length
    }
  ]

  const toggleSystemExpansion = (systemId: string) => {
    const newExpanded = new Set(expandedSystems)
    if (newExpanded.has(systemId)) {
      newExpanded.delete(systemId)
    } else {
      newExpanded.add(systemId)
    }
    setExpandedSystems(newExpanded)
  }

  const filterData = () => {
    let data: any[] = []
    
    switch (activeView) {
      case 'function-submissions':
        data = functionSubmissions
        break
      case 'test-cases':
        data = testCasesState
        break
      case 'test-reports':
        data = testReports
        break
    }

    // 应用搜索关键词过滤
    if (searchKeyword) {
      data = data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchKeyword.toLowerCase())
      )
    }

    // 应用模块过滤（如果选择的不是"全部"）
    if (selectedModule && selectedModule !== '全部') {
      data = data.filter(item => {
        let moduleName = ''
        
        if (activeView === 'test-cases' && 'functionId' in item) {
          // 对于测试用例，通过functionId查找对应的功能提测
          const functionSubmission = functionSubmissions.find(fs => fs.functionId === item.functionId)
          moduleName = functionSubmission?.moduleName || ''
        } else {
          moduleName = (item as any).moduleName || (item as any).module || ''
        }
        
        return moduleName === selectedModule
      })
    } else if (selectedModule === '全部') {
      // 显示所有数据，不进行模块过滤
      // 数据已经是所有数据，无需额外处理
    }

    return data
  }

  const filteredData = filterData()

  const handleCreateFunction = () => {
    setShowFunctionForm(true)
  }

  const handleGenerateTestCases = (functionSubmission?: FunctionSubmission) => {
    if (functionSubmission) {
      setSelectedFunctionForGeneration(functionSubmission)
    } else {
      // 如果没有选择具体的功能，使用第一个功能提测作为示例
      setSelectedFunctionForGeneration(functionSubmissions[0] || null)
    }
    setShowTestCaseGenerator(true)
  }

  const handleFunctionSubmit = (data: Partial<FunctionSubmission>) => {
    console.log('提交功能提测:', data)
    setShowFunctionForm(false)
    // 这里可以添加实际的数据保存逻辑
  }

  const handleTestCaseGeneration = (generated: Partial<TestCase>[]) => {
    const fnId = selectedFunctionForGeneration?.functionId || functionSubmissions[0]?.functionId || 'FUNC-UNKNOWN'
    const now = new Date()
    const toAdd: TestCase[] = generated.map(gc => ({
      id: gc.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      functionId: fnId,
      testCaseId: gc.testCaseId || `TC-${Date.now().toString().slice(-6)}`,
      description: gc.description || '',
      steps: gc.steps || [],
      expectedResult: gc.expectedResult || '',
      priority: gc.priority || 'medium',
      status: gc.status || 'draft',
      executionCount: 0,
      lastExecutionResult: 'pending',
      createdAt: now,
      updatedAt: now,
      aiGenerated: true,
      templateId: gc.templateId,
      category: gc.category,
    }))
    setTestCasesState(prev => [...toAdd, ...prev])
    setShowTestCaseGenerator(false)
  }

  const renderTableHeader = () => {
    switch (activeView) {
      case 'function-submissions':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-28">功能编号</th>
            <th className="px-3 py-3 text-left font-medium w-24">系统名称</th>
            <th className="px-3 py-3 text-left font-medium w-24">模块名称</th>
            <th className="px-3 py-3 text-left font-medium w-32">功能介绍</th>
            <th className="px-3 py-3 text-left font-medium w-32">验收标准</th>
            <th className="px-3 py-3 text-left font-medium w-32">使用流程描述</th>
            <th className="px-3 py-3 text-left font-medium w-20">审核状态</th>
            <th className="px-3 py-3 text-left font-medium w-24">操作</th>
          </tr>
        )
      case 'test-cases':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-24">单元测试编号</th>
            <th className="px-3 py-3 text-left font-medium w-20">功能编号</th>
            <th className="px-3 py-3 text-left font-medium w-32">测试用例描述</th>
            <th className="px-3 py-3 text-left font-medium w-28">测试分类</th>
            <th className="px-3 py-3 text-left font-medium w-36">测试步骤</th>
            <th className="px-3 py-3 text-left font-medium w-32">期望结果</th>
            <th className="px-3 py-3 text-left font-medium w-16">执行次数</th>
            <th className="px-3 py-3 text-left font-medium w-24">最后执行结果</th>
            <th className="px-3 py-3 text-left font-medium w-28">操作</th>
          </tr>
        )
      case 'test-reports':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-32">报告名称</th>
            <th className="px-3 py-3 text-left font-medium w-24">系统名称</th>
            <th className="px-3 py-3 text-left font-medium w-24">模块名称</th>
            <th className="px-3 py-3 text-left font-medium w-16">总用例数</th>
            <th className="px-3 py-3 text-left font-medium w-16">通过用例数</th>
            <th className="px-3 py-3 text-left font-medium w-16">失败用例数</th>
            <th className="px-3 py-3 text-left font-medium w-16">通过率</th>
            <th className="px-3 py-3 text-left font-medium w-24">操作</th>
          </tr>
        )
      default:
        return null
    }
  }

  const renderTableRow = (item: any, index: number) => {
    switch (activeView) {
      case 'function-submissions':
        return (
          <tr key={item.id} className={cn(
            "border-t hover:bg-muted/50",
            index % 2 === 0 ? "bg-muted/20" : ""
          )}>
            <td className="px-3 py-2 text-sm">{item.functionId}</td>
            <td className="px-3 py-2 text-sm">{item.systemName}</td>
            <td className="px-3 py-2 text-sm">{item.moduleName}</td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.description}>
                  {item.description.length > 20 ? `${item.description.substring(0, 20)}...` : item.description}
                </span>
                {item.description.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('功能介绍', item.description)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.acceptanceCriteria}>
                  {item.acceptanceCriteria.length > 20 ? `${item.acceptanceCriteria.substring(0, 20)}...` : item.acceptanceCriteria}
                </span>
                {item.acceptanceCriteria.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('验收标准', item.acceptanceCriteria)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.usageProcess}>
                  {item.usageProcess.length > 20 ? `${item.usageProcess.substring(0, 20)}...` : item.usageProcess}
                </span>
                {item.usageProcess.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('使用流程描述', item.usageProcess)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                item.status === 'approved' ? "bg-green-100 text-green-800" :
                item.status === 'rejected' ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              )}>
                {item.status === 'approved' ? '已通过' : 
                 item.status === 'rejected' ? '已拒绝' : '待审核'}
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerateTestCases(item)}
                className="gap-1"
              >
                <Brain className="h-3 w-3" />
                生成用例
              </Button>
            </td>
          </tr>
        )
      case 'test-cases':
        return (
          <tr key={item.id} className={cn(
            "border-t hover:bg-muted/50",
            index % 2 === 0 ? "bg-muted/20" : ""
          )}>
            <td className="px-3 py-2 text-sm">{item.testCaseId}</td>
            <td className="px-3 py-2 text-sm">{item.functionId}</td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.description}>
                  {item.description.length > 20 ? `${item.description.substring(0, 20)}...` : item.description}
                </span>
                {item.description.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('测试用例描述', item.description)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <span className={cn("px-2 py-1 rounded text-xs font-medium", categoryClass((item as TestCase).category))}>
                {categoryLabel((item as TestCase).category)}
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-32" title={item.steps.join(' → ')}>
                  {item.steps.slice(0, 2).join(' → ')}
                  {item.steps.length > 2 && '...'}
                </span>
                {item.steps.length > 2 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('测试步骤', item.steps.join(' → '))}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.expectedResult}>
                  {item.expectedResult.length > 20 ? `${item.expectedResult.substring(0, 20)}...` : item.expectedResult}
                </span>
                {item.expectedResult.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('期望结果', item.expectedResult)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">{item.executionCount}</td>
            <td className="px-3 py-2 text-sm">
              {item.lastExecutionResult && (
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  item.lastExecutionResult === 'pass' ? "bg-green-100 text-green-800" :
                  item.lastExecutionResult === 'fail' ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                )}>
                  {item.lastExecutionResult === 'pass' ? '通过' :
                   item.lastExecutionResult === 'fail' ? '失败' : '待执行'}
                </span>
              )}
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedTestCase(item as TestCase)
                    setShowTestCaseDetail(true)
                  }}
                  className="gap-1"
                >
                  <FileText className="h-3 w-3" />
                  查看详情
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditValues({
                      id: (item as TestCase).id,
                      description: (item as TestCase).description,
                      stepsText: (item as TestCase).steps.join('\n'),
                      expectedResult: (item as TestCase).expectedResult,
                      priority: (item as TestCase).priority,
                      status: (item as TestCase).status,
                      category: (item as TestCase).category || 'normal',
                    })
                    setShowTestCaseEdit(true)
                  }}
                  className="gap-1"
                >
                  编辑
                </Button>
              </div>
            </td>
          </tr>
        )
      case 'test-reports':
        return (
          <tr key={item.id} className={cn(
            "border-t hover:bg-muted/50",
            index % 2 === 0 ? "bg-muted/20" : ""
          )}>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.name}>
                  {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                </span>
                {item.name.length > 20 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => handleShowDetail('报告名称', item.name)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">{item.systemName}</td>
            <td className="px-3 py-2 text-sm">{item.moduleName}</td>
            <td className="px-3 py-2 text-sm">{item.totalCases}</td>
            <td className="px-3 py-2 text-sm text-green-600">{item.passedCases}</td>
            <td className="px-3 py-2 text-sm text-red-600">{item.failedCases}</td>
            <td className="px-3 py-2 text-sm">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                item.passRate >= 80 ? "bg-green-100 text-green-800" :
                item.passRate >= 60 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {item.passRate.toFixed(1)}%
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedReportId(item.id)
                  setShowReportDetail(true)
                }}
                className="gap-1"
              >
                <BarChart3 className="h-3 w-3" />
                查看详情
              </Button>
            </td>
          </tr>
        )
      default:
        return null
    }
  }

  const renderModuleTree = () => {
    // 根据当前视图获取正确的总数量
    const getTotalCount = () => {
      switch (activeView) {
        case 'function-submissions':
          return functionSubmissions.length
        case 'test-cases':
          return testCasesState.length
        case 'test-reports':
          return testReports.length
        default:
          return 0
      }
    }
    
    // 获取当前视图的数据
    const getCurrentData = () => {
      switch (activeView) {
        case 'function-submissions':
          return functionSubmissions
        case 'test-cases':
          return testCasesState
        case 'test-reports':
          return testReports
        default:
          return []
      }
    }
    
    const totalCount = getTotalCount()
    const currentData = getCurrentData()
    
    // 计算每个系统/模块在当前视图中的数量
    const getModuleCount = (moduleName: string) => {
      return currentData.filter(item => {
        let itemModuleName = ''
        
        if (activeView === 'test-cases' && 'functionId' in item) {
          // 对于测试用例，通过functionId查找对应的功能提测
          const functionSubmission = functionSubmissions.find(fs => fs.functionId === item.functionId)
          itemModuleName = functionSubmission?.moduleName || ''
        } else {
          itemModuleName = (item as any).moduleName || (item as any).module || ''
        }
        
        return itemModuleName === moduleName
      }).length
    }
    
    // 计算每个系统的总数量
    const getSystemCount = (systemName: string) => {
      return currentData.filter(item => {
        let itemSystemName = ''
        
        if (activeView === 'test-cases' && 'functionId' in item) {
          // 对于测试用例，通过functionId查找对应的功能提测
          const functionSubmission = functionSubmissions.find(fs => fs.functionId === item.functionId)
          itemSystemName = functionSubmission?.systemName || ''
        } else {
          itemSystemName = (item as any).systemName || ''
        }
        
        return itemSystemName === systemName
      }).length
    }
    
    return (
      <div className="space-y-1">
        {/* "全部"顶层节点 */}
        <div
          className={cn(
            "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted",
            selectedModule === '全部' && "bg-primary/10 text-primary"
          )}
          onClick={() => setSelectedModule('全部')}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">全部</span>
          </div>
          <span className="text-xs text-muted-foreground">{totalCount}</span>
        </div>
        
        {/* 系统模块 */}
        {systemModules.map(system => {
          const isExpanded = expandedSystems.has(system.id)
          return (
            <div key={system.id}>
              <div
                className={cn(
                  "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted",
                  selectedModule === system.name && "bg-primary/10 text-primary"
                )}
                onClick={() => {
                  if (selectedModule === system.name) {
                    setSelectedModule('全部')
                  } else {
                    setSelectedModule(system.name)
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {system.children && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSystemExpansion(system.id)
                      }}
                    >
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                  )}
                  <span className="text-sm font-medium">{system.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{getSystemCount(system.name)}</span>
              </div>
              
              {isExpanded && system.children && (
                <div className="ml-4 space-y-1">
                  {system.children.map(module => (
                    <div
                      key={module.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted",
                        selectedModule === module.name && "bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        if (selectedModule === module.name) {
                          setSelectedModule('全部')
                        } else {
                          setSelectedModule(module.name)
                        }
                      }}
                    >
                      <span className="text-sm">{module.name}</span>
                      <span className="text-xs text-muted-foreground">{getModuleCount(module.name)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex">
        {/* 左侧导航栏 */}
        <div className={cn(
          "bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-56"
        )}>
          {/* 顶部Logo和控制按钮 */}
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="font-semibold text-sidebar-foreground">AI辅助测试管理</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* 导航菜单 */}
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon
                const isActive = activeView === item.id
                
                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.id} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-center h-10 p-0",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                          onClick={() => setActiveView(item.id)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label} ({item.count})</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 h-10",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => setActiveView(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                    <span className="ml-auto text-xs opacity-70">{item.count}</span>
                  </Button>
                )
              })}
            </div>
            
            {/* AI工具快捷入口 */}
            {!sidebarCollapsed && (
              <div className="mt-6 pt-6 border-t border-sidebar-border">
                <h4 className="text-xs font-medium text-muted-foreground mb-3 px-2">AI工具</h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-8"
                    onClick={() => setShowTemplateManager(true)}
                  >
                    <Settings className="h-3 w-3" />
                    <span className="text-xs">模板管理</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-8"
                    onClick={() => handleGenerateTestCases()}
                  >
                    <Brain className="h-3 w-3" />
                    <span className="text-xs">AI生成用例</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* 底部设置 */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-sidebar-border">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">系统设置</span>
              </Button>
            </div>
          )}
        </div>

        {/* 中间筛选区域 */}
        <div className={cn(
          "bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "flex-1" : "w-64"
        )}>
          {/* 搜索框 */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="请输入搜索关键词"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* 模块树形结构 */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-medium mb-4 text-muted-foreground">系统模块</h3>
            {renderModuleTree()}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col bg-background">
          {/* 内容头部 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">
                  {navItems.find(item => item.id === activeView)?.label}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  共 {filteredData.length} 条记录
                  {selectedModule && selectedModule !== '全部' && ` · 已选择模块: ${selectedModule}`}
                </p>
              </div>
              <div className="flex gap-2">
                {activeView === 'function-submissions' && (
                  <Button onClick={handleCreateFunction} className="gap-2">
                    <Plus className="h-4 w-4" />
                    新建提测
                  </Button>
                )}
                {activeView === 'test-cases' && (
                  <Button onClick={() => setShowTemplateManager(true)} variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    模板管理
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 p-6">
            <Card className="h-full">
              <div className="h-full overflow-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-muted/50 sticky top-0">
                    {renderTableHeader()}
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => renderTableRow(item, index))
                    ) : (
                      <tr>
                        <td colSpan={activeView === 'test-reports' ? 8 : activeView === 'test-cases' ? 9 : 8} className="px-4 py-8 text-center text-muted-foreground">
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

        {/* 功能提测表单对话框 */}
        <Dialog open={showFunctionForm} onOpenChange={setShowFunctionForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新建功能提测</DialogTitle>
            </DialogHeader>
            <FunctionSubmissionForm
              onSubmit={handleFunctionSubmit}
              onCancel={() => setShowFunctionForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* 测试用例生成对话框 */}
        <Dialog open={showTestCaseGenerator} onOpenChange={setShowTestCaseGenerator}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI生成测试用例</DialogTitle>
            </DialogHeader>
            {selectedFunctionForGeneration && (
              <TestCaseGenerator
                functionDescription={selectedFunctionForGeneration.description}
                acceptanceCriteria={selectedFunctionForGeneration.acceptanceCriteria}
                usageProcess={selectedFunctionForGeneration.usageProcess}
                onGenerate={handleTestCaseGeneration}
                onClose={() => setShowTestCaseGenerator(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 模板管理对话框 */}
        <Dialog open={showTemplateManager} onOpenChange={setShowTemplateManager}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>测试用例模板管理</DialogTitle>
            </DialogHeader>
            <TemplateManager
              onClose={() => setShowTemplateManager(false)}
            />
          </DialogContent>
        </Dialog>

        {/* 详情查看对话框 */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{detailContent.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{detailContent.content}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 测试报告详情对话框 */}
        <Dialog open={showReportDetail} onOpenChange={setShowReportDetail}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>测试报告详情</DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[80vh] overflow-y-auto">
              {selectedReportId && (
                <TestReportDetail
                  reportId={selectedReportId}
                  onClose={() => setShowReportDetail(false)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showTestCaseDetail} onOpenChange={setShowTestCaseDetail}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>测试用例详情</DialogTitle>
            </DialogHeader>
            {selectedTestCase && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">单元测试编号</div>
                    <div className="text-sm mt-1">{selectedTestCase.testCaseId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">功能编号</div>
                    <div className="text-sm mt-1">{selectedTestCase.functionId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">优先级</div>
                    <div className="text-sm mt-1">
                      {selectedTestCase.priority === 'high' ? '高' : selectedTestCase.priority === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">状态</div>
                    <div className="text-sm mt-1">
                      {selectedTestCase.status === 'draft' ? '草稿' : selectedTestCase.status === 'active' ? '有效' : '废弃'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试分类</div>
                  <div className="text-sm mt-1">
                    <span className={cn("px-2 py-1 rounded text-xs font-medium", categoryClass(selectedTestCase.category))}>
                      {categoryLabel(selectedTestCase.category)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试用例描述</div>
                  <div className="text-sm mt-1 whitespace-pre-wrap">{selectedTestCase.description}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试步骤</div>
                  <ol className="text-sm mt-2 space-y-1">
                    {selectedTestCase.steps.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">期望结果</div>
                  <div className="text-sm mt-1 whitespace-pre-wrap">{selectedTestCase.expectedResult}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">执行次数</div>
                    <div className="text-sm mt-1">{selectedTestCase.executionCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">最后执行结果</div>
                    <div className="text-sm mt-1">
                      {selectedTestCase.lastExecutionResult === 'pass' ? '通过' :
                       selectedTestCase.lastExecutionResult === 'fail' ? '失败' :
                       selectedTestCase.lastExecutionResult === 'pending' ? '待执行' : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowTestCaseDetail(false)} className="flex-1">关闭</Button>
                  <Button onClick={() => {
                    setEditValues({
                      id: selectedTestCase.id,
                      description: selectedTestCase.description,
                      stepsText: selectedTestCase.steps.join('\n'),
                      expectedResult: selectedTestCase.expectedResult,
                      priority: selectedTestCase.priority,
                      status: selectedTestCase.status,
                      category: selectedTestCase.category || 'normal'
                    })
                    setShowTestCaseDetail(false)
                    setShowTestCaseEdit(true)
                  }} className="flex-1">编辑</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <Dialog open={showTestCaseEdit} onOpenChange={setShowTestCaseEdit}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑测试用例</DialogTitle>
            </DialogHeader>
            {editValues && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">优先级</div>
                    <div className="mt-1">
                      <Select value={editValues.priority} onValueChange={(v) => setEditValues(prev => prev ? { ...prev, priority: v as 'high' | 'medium' | 'low' } : prev)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">状态</div>
                    <div className="mt-1">
                      <Select value={editValues.status} onValueChange={(v) => setEditValues(prev => prev ? { ...prev, status: v as 'draft' | 'active' | 'deprecated' } : prev)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">草稿</SelectItem>
                          <SelectItem value="active">有效</SelectItem>
                          <SelectItem value="deprecated">废弃</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试分类</div>
                  <div className="mt-1">
                    <Select value={editValues.category || 'normal'} onValueChange={(v) => setEditValues(prev => prev ? { ...prev, category: v as 'normal' | 'exception' | 'boundary' | 'error_handling' } : prev)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常路径测试</SelectItem>
                        <SelectItem value="exception">异常路径测试</SelectItem>
                        <SelectItem value="boundary">边界条件测试</SelectItem>
                        <SelectItem value="error_handling">错误处理测试</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试用例描述</div>
                  <Textarea value={editValues.description} onChange={(e) => setEditValues(prev => prev ? { ...prev, description: e.target.value } : prev)} className="mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">测试步骤（每行一个步骤）</div>
                  <Textarea value={editValues.stepsText} onChange={(e) => setEditValues(prev => prev ? { ...prev, stepsText: e.target.value } : prev)} className="mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">期望结果</div>
                  <Textarea value={editValues.expectedResult} onChange={(e) => setEditValues(prev => prev ? { ...prev, expectedResult: e.target.value } : prev)} className="mt-1" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowTestCaseEdit(false)} className="flex-1">取消</Button>
                  <Button
                    onClick={() => {
                      if (!editValues) return
                      const updated = testCasesState.map(tc => {
                        if (tc.id === editValues.id) {
                          return {
                            ...tc,
                            description: editValues.description,
                            steps: editValues.stepsText.split('\n').map(s => s.trim()).filter(s => s.length > 0),
                            expectedResult: editValues.expectedResult,
                            priority: editValues.priority,
                            status: editValues.status,
                            category: (editValues as any).category,
                            updatedAt: new Date()
                          }
                        }
                        return tc
                      })
                      setTestCasesState(updated)
                      setShowTestCaseEdit(false)
                    }}
                    className="flex-1"
                  >
                    保存
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </TooltipProvider>
  )
}

export default App
