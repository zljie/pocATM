import { useState, useEffect } from 'react'
import { Card } from './components/ui/card'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { DialogContent as AlertDialogContent, DialogHeader as AlertDialogHeader, DialogTitle as AlertDialogTitle } from './components/ui/dialog'
import { Home, FileText, Users, Search, ChevronDown, ChevronRight, Plus, Settings, BarChart3, Brain, Menu, X, Calendar } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { cn } from './lib/utils'
import { systemModules, functionSubmissions, testCases, testReports } from './data/mockData'
import { FunctionSubmissionForm } from './components/FunctionSubmissionForm'
import { TestCaseGenerator } from './components/TestCaseGenerator'
import { TemplateManager } from './components/TemplateManager'
import { TestReportDetail } from './components/TestReportDetail'
import { RequirementImport } from './components/RequirementImport'
import { TestPlanDetail } from './components/TestPlanDetail'
import { CreateTestPlanForm } from './components/CreateTestPlanForm'
import { useTestManagement } from './hooks/useTestManagement'
import type { SystemModule, FunctionSubmission, TestCase, Requirement, TestPlan } from './types'

type ActiveView = 'requirements' | 'test-plans' | 'test-cases' | 'test-reports'

function App() {
  // 使用数据管理Hook
  const {
    requirements,
    testPlans,
    requirementsLoading,
    testPlansLoading,
    importRequirements,
    createTestPlan,
    updateTestPlan,
    updateProgress,
    setRequirements
  } = useTestManagement()

  const [activeView, setActiveView] = useState<ActiveView>('requirements')
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
  const [showTestPlanDetail, setShowTestPlanDetail] = useState(false)
  const [selectedTestPlanId, setSelectedTestPlanId] = useState<string>('')
  const [showCreateTestPlan, setShowCreateTestPlan] = useState(false)
  const [showRequirementEdit, setShowRequirementEdit] = useState(false)
  const [editRequirement, setEditRequirement] = useState<Requirement | null>(null)
  const [showRequirementGenerator, setShowRequirementGenerator] = useState(false)
  const [selectedRequirementForGeneration, setSelectedRequirementForGeneration] = useState<Requirement | null>(null)
  
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
      id: 'requirements' as ActiveView,
      label: '需求导入清单',
      icon: FileText,
      count: requirements.length
    },
    {
      id: 'test-plans' as ActiveView,
      label: '测试计划清单',
      icon: Calendar,
      count: testPlans.length
    },
    {
      id: 'test-cases' as ActiveView,
      label: '测试用例清单',
      icon: Users,
      count: testCases.length
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
      case 'requirements':
        data = requirements
        break
      case 'test-plans':
        data = testPlans
        break
      case 'test-cases':
        data = testCases
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
        } else if (activeView === 'requirements') {
          moduleName = item.module || ''
        } else if (activeView === 'test-plans') {
          // 对于测试计划，通过关联的需求查找模块
          if (item.requirements && item.requirements.length > 0) {
            const relatedReq = requirements.find(req => req.id === item.requirements[0])
            moduleName = relatedReq?.module || ''
          }
        } else {
          moduleName = (item as any).moduleName || (item as any).module || ''
        }
        
        return moduleName === selectedModule
      })
    }

    return data
  }

  const filteredData = filterData()

  const handleCreateTestPlan = () => {
    setShowCreateTestPlan(true)
  }

  const handleTestPlanSubmit = async (data: any) => {
    console.log('创建测试计划:', data)
    try {
      const newPlan = await createTestPlan(data)
      console.log('测试计划创建成功:', newPlan)
      setShowCreateTestPlan(false)
    } catch (error) {
      console.error('创建测试计划失败:', error)
      alert('创建测试计划失败，请稍后重试')
    }
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

  const handleTestCaseGeneration = (testCases: Partial<TestCase>[]) => {
    console.log('生成测试用例:', testCases)
    setShowTestCaseGenerator(false)
    // 这里可以添加实际的数据保存逻辑
  }

  const handleRequirementImport = async (selectedRequirements: Requirement[]) => {
    console.log('导入需求:', selectedRequirements)
    try {
      // 这里可以实现具体的导入逻辑
      // 比如创建测试计划并导入需求
      const requirementIds = selectedRequirements.map(req => req.id)
      // await importRequirements(requirementIds, testPlanId)
      alert(`成功导入 ${selectedRequirements.length} 个需求`)
    } catch (error) {
      console.error('导入需求失败:', error)
      alert('导入需求失败，请稍后重试')
    }
  }

  const renderTableHeader = () => {
    switch (activeView) {
      case 'requirements':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-28">需求编号</th>
            <th className="px-3 py-3 text-left font-medium w-24">系统名称</th>
            <th className="px-3 py-3 text-left font-medium w-24">模块名称</th>
            <th className="px-3 py-3 text-left font-medium w-32">需求标题</th>
            <th className="px-3 py-3 text-left font-medium w-20">优先级</th>
            <th className="px-3 py-3 text-left font-medium w-20">状态</th>
            <th className="px-3 py-3 text-left font-medium w-28">操作</th>
          </tr>
        )
      case 'test-plans':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-32">计划名称</th>
            <th className="px-3 py-3 text-left font-medium w-24">开始时间</th>
            <th className="px-3 py-3 text-left font-medium w-24">结束时间</th>
            <th className="px-3 py-3 text-left font-medium w-20">负责人</th>
            <th className="px-3 py-3 text-left font-medium w-16">进度</th>
            <th className="px-3 py-3 text-left font-medium w-20">状态</th>
            <th className="px-3 py-3 text-left font-medium w-24">操作</th>
          </tr>
        )
      case 'test-cases':
        return (
          <tr>
            <th className="px-3 py-3 text-left font-medium w-24">单元测试编号</th>
            <th className="px-3 py-3 text-left font-medium w-20">功能编号</th>
            <th className="px-3 py-3 text-left font-medium w-32">测试用例描述</th>
            <th className="px-3 py-3 text-left font-medium w-36">测试步骤</th>
            <th className="px-3 py-3 text-left font-medium w-32">期望结果</th>
            <th className="px-3 py-3 text-left font-medium w-16">执行次数</th>
            <th className="px-3 py-3 text-left font-medium w-24">最后执行结果</th>
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

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return '未知'
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'imported': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'in_progress_plan': return 'bg-blue-100 text-blue-800'
      case 'completed_plan': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理'
      case 'imported': return '已导入'
      case 'in_progress': return '进行中'
      case 'completed': return '已完成'
      case 'draft': return '草稿'
      case 'in_progress_plan': return '执行中'
      case 'completed_plan': return '已完成'
      case 'cancelled': return '已取消'
      default: return '未知'
    }
  }

  const renderTableRow = (item: any, index: number) => {
    switch (activeView) {
      case 'requirements':
        return (
          <tr key={item.id} className={cn(
            "border-t hover:bg-muted/50",
            index % 2 === 0 ? "bg-muted/20" : ""
          )}>
            <td className="px-3 py-2 text-sm">{item.id}</td>
            <td className="px-3 py-2 text-sm">{item.system}</td>
            <td className="px-3 py-2 text-sm">{item.module}</td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="truncate max-w-28" title={item.title}>
                  {item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={() => handleShowDetail('需求描述', item.description)}
                  title="查看需求描述"
                >
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                getPriorityColor(item.priority)
              )}>
                {getPriorityText(item.priority)}
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                getStatusColor(item.status)
              )}>
                {getStatusText(item.status)}
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditRequirement(item as Requirement)
                    setShowRequirementEdit(true)
                  }}
                >
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedRequirementForGeneration(item as Requirement)
                    setShowRequirementGenerator(true)
                  }}
                  className="gap-1"
                >
                  <Brain className="h-3 w-3" />
                  转测试用例
                </Button>
              </div>
            </td>
          </tr>
        )
      case 'test-plans':
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
                    onClick={() => handleShowDetail('计划名称', item.name)}
                  >
                    <FileText className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </td>
            <td className="px-3 py-2 text-sm">{new Date(item.startDate).toLocaleDateString()}</td>
            <td className="px-3 py-2 text-sm">{new Date(item.endDate).toLocaleDateString()}</td>
            <td className="px-3 py-2 text-sm">{item.assignedTo.join(', ')}</td>
            <td className="px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-blue-500 rounded" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs">{item.progress}%</span>
              </div>
            </td>
            <td className="px-3 py-2 text-sm">
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                getStatusColor(item.status)
              )}>
                {getStatusText(item.status)}
              </span>
            </td>
            <td className="px-3 py-2 text-sm">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedTestPlanId(item.id)
                  setShowTestPlanDetail(true)
                }}
                className="gap-1"
              >
                <Calendar className="h-3 w-3" />
                查看详情
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
        case 'requirements':
          return requirements.length
        case 'test-plans':
          return testPlans.length
        case 'test-cases':
          return testCases.length
        case 'test-reports':
          return testReports.length
        default:
          return 0
      }
    }
    
    // 获取当前视图的数据
    const getCurrentData = () => {
      switch (activeView) {
        case 'requirements':
          return requirements
        case 'test-plans':
          return testPlans
        case 'test-cases':
          return testCases
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
        } else if (activeView === 'requirements') {
          itemModuleName = (item as Requirement).module || ''
        } else if (activeView === 'test-plans') {
          // 对于测试计划，通过关联的需求查找模块
          const testPlan = item as TestPlan
          if (testPlan.requirements && testPlan.requirements.length > 0) {
            const relatedReq = requirements.find(req => req.id === testPlan.requirements[0])
            itemModuleName = relatedReq?.module || ''
          }
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
        } else if (activeView === 'requirements') {
          itemSystemName = (item as Requirement).system || ''
        } else if (activeView === 'test-plans') {
          // 对于测试计划，通过关联的需求查找系统
          const testPlan = item as TestPlan
          if (testPlan.requirements && testPlan.requirements.length > 0) {
            const relatedReq = requirements.find(req => req.id === testPlan.requirements[0])
            itemSystemName = relatedReq?.system || ''
          }
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
                {activeView === 'requirements' && (
                  <RequirementImport onImport={handleRequirementImport} />
                )}
                {activeView === 'test-plans' && (
                  <Button onClick={handleCreateTestPlan} className="gap-2">
                    <Plus className="h-4 w-4" />
                    新建计划
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
                        <td colSpan={activeView === 'test-reports' ? 8 : activeView === 'requirements' ? 7 : activeView === 'test-plans' ? 7 : 7} className="px-4 py-8 text-center text-muted-foreground">
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

      {/* 需求导入对话框 */}
      {/* Dialogs */}
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

      {/* 需求编辑对话框 */}
      <Dialog open={showRequirementEdit} onOpenChange={setShowRequirementEdit}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑需求</DialogTitle>
          </DialogHeader>
          {editRequirement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">需求标题</div>
                  <Input value={editRequirement.title} onChange={(e) => setEditRequirement({ ...editRequirement, title: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">优先级</div>
                  <div className="mt-1">
                    <Select value={editRequirement.priority} onValueChange={(v) => setEditRequirement({ ...editRequirement, priority: v as 'high' | 'medium' | 'low' })}>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">系统名称</div>
                  <Input value={editRequirement.system} onChange={(e) => setEditRequirement({ ...editRequirement, system: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">模块名称</div>
                  <Input value={editRequirement.module} onChange={(e) => setEditRequirement({ ...editRequirement, module: e.target.value })} className="mt-1" />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">需求描述</div>
                <Textarea value={editRequirement.description} onChange={(e) => setEditRequirement({ ...editRequirement, description: e.target.value })} className="mt-1" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">状态</div>
                <div className="mt-1">
                  <Select value={editRequirement.status} onValueChange={(v) => setEditRequirement({ ...editRequirement, status: v as 'pending' | 'imported' | 'in_progress' | 'completed' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="imported">已导入</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowRequirementEdit(false)} className="flex-1">取消</Button>
                <Button
                  onClick={() => {
                    if (!editRequirement) return
                    const updated = requirements.map(r => r.id === editRequirement.id ? { ...editRequirement, updatedAt: new Date() } : r)
                    setRequirements(updated)
                    setShowRequirementEdit(false)
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

      {/* 需求转测试用例对话框 */}
      <Dialog open={showRequirementGenerator} onOpenChange={setShowRequirementGenerator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>根据需求生成测试用例</DialogTitle>
          </DialogHeader>
          {selectedRequirementForGeneration && (
            <TestCaseGenerator
              functionDescription={selectedRequirementForGeneration.description}
              acceptanceCriteria={''}
              usageProcess={''}
              onGenerate={handleTestCaseGeneration}
              onClose={() => setShowRequirementGenerator(false)}
            />
          )}
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

      {/* 测试计划详情对话框 */}
      <Dialog open={showTestPlanDetail} onOpenChange={setShowTestPlanDetail}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>测试计划详情</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 h-[calc(95vh-120px)] overflow-y-auto">
            {selectedTestPlanId && (
              <TestPlanDetail
                testPlan={testPlans.find(plan => plan.id === selectedTestPlanId)!}
                onClose={() => setShowTestPlanDetail(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 新建测试计划对话框 */}
      <Dialog open={showCreateTestPlan} onOpenChange={setShowCreateTestPlan}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新建测试计划</DialogTitle>
          </DialogHeader>
          <CreateTestPlanForm
            onSubmit={handleTestPlanSubmit}
            onCancel={() => setShowCreateTestPlan(false)}
          />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default App
