import { supabase, TABLES, handleSupabaseError } from '../lib/supabase'
import type { Requirement, TestPlan, TestCaseSelection, BurndownPoint } from '../types'

// 需求数据访问层
export class RequirementsService {
  // 获取所有需求
  static async getAll(): Promise<Requirement[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.REQUIREMENTS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取需求列表失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 根据系统筛选需求
  static async getBySystem(system: string): Promise<Requirement[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.REQUIREMENTS)
        .select('*')
        .eq('system', system)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('根据系统获取需求失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 导入需求到测试计划
  static async importToTestPlan(requirementIds: string[], testPlanId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.REQUIREMENTS)
        .update({ 
          status: 'imported', 
          imported_at: new Date().toISOString(),
          test_plan_id: testPlanId 
        })
        .in('id', requirementIds)

      if (error) throw error
    } catch (error) {
      console.error('导入需求失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 创建新需求
  static async create(requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Requirement> {
    try {
      const { data, error } = await supabase
        .from(TABLES.REQUIREMENTS)
        .insert({
          title: requirement.title,
          description: requirement.description,
          system: requirement.system,
          module: requirement.module,
          priority: requirement.priority,
          status: requirement.status,
          imported_at: requirement.importedAt?.toISOString(),
          test_plan_id: requirement.testPlanId
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('创建需求失败')
      
      return data as Requirement
    } catch (error) {
      console.error('创建需求失败:', error)
      throw handleSupabaseError(error)
    }
  }
}

// 测试计划数据访问层
export class TestPlansService {
  // 获取所有测试计划
  static async getAll(): Promise<TestPlan[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEST_PLANS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取测试计划列表失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 根据ID获取测试计划
  static async getById(planId: string): Promise<TestPlan | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEST_PLANS)
        .select('*')
        .eq('plan_id', planId)
        .maybeSingle()

      if (error) throw error
      return data as TestPlan | null
    } catch (error) {
      console.error('获取测试计划详情失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 创建新测试计划
  static async create(plan: Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestPlan> {
    try {
      // 生成唯一ID
      const planId = `PLAN-${Date.now()}`
      
      const { data, error } = await supabase
        .from(TABLES.TEST_PLANS)
        .insert({
          plan_id: planId,
          name: plan.name,
          description: plan.description,
          status: plan.status,
          start_date: plan.startDate.toISOString().split('T')[0],
          end_date: plan.endDate.toISOString().split('T')[0],
          assigned_to: plan.assignedTo,
          requirements: plan.requirements,
          test_cases: plan.testCases,
          progress: plan.progress,
          burndown_data: plan.burndownData
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('创建测试计划失败')
      
      return data as TestPlan
    } catch (error) {
      console.error('创建测试计划失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 更新测试计划
  static async update(planId: string, updates: Partial<TestPlan>): Promise<TestPlan> {
    try {
      const updateData: any = { ...updates }
      
      // 处理日期字段
      if (updates.startDate) {
        updateData.start_date = updates.startDate.toISOString().split('T')[0]
      }
      if (updates.endDate) {
        updateData.end_date = updates.endDate.toISOString().split('T')[0]
      }

      const { data, error } = await supabase
        .from(TABLES.TEST_PLANS)
        .update(updateData)
        .eq('plan_id', planId)
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('更新测试计划失败')
      
      return data as TestPlan
    } catch (error) {
      console.error('更新测试计划失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 更新测试计划进度
  static async updateProgress(planId: string, progress: number): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.TEST_PLANS)
        .update({ progress, updated_at: new Date().toISOString() })
        .eq('plan_id', planId)

      if (error) throw error
    } catch (error) {
      console.error('更新测试计划进度失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 更新燃尽图数据
  static async updateBurndownData(planId: string, burndownData: BurndownPoint[]): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.TEST_PLANS)
        .update({ 
          burndown_data: burndownData,
          updated_at: new Date().toISOString() 
        })
        .eq('plan_id', planId)

      if (error) throw error
    } catch (error) {
      console.error('更新燃尽图数据失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 删除测试计划
  static async delete(planId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.TEST_PLANS)
        .delete()
        .eq('plan_id', planId)

      if (error) throw error
    } catch (error) {
      console.error('删除测试计划失败:', error)
      throw handleSupabaseError(error)
    }
  }
}

// 测试用例执行数据访问层
export class TestCaseExecutionsService {
  // 获取测试计划的所有用例执行记录
  static async getByPlanId(planId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEST_CASE_EXECUTIONS)
        .select('*')
        .eq('test_plan_id', planId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取测试用例执行记录失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 创建测试用例执行记录
  static async create(execution: Omit<TestCaseSelection, 'testCaseId'> & { testPlanId: string; testCaseId: string }) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEST_CASE_EXECUTIONS)
        .insert({
          test_plan_id: execution.testPlanId,
          test_case_id: execution.testCaseId,
          priority: execution.priority,
          expected_execution_time: execution.expectedExecutionTime,
          actual_execution_time: execution.actualExecutionTime,
          status: execution.status,
          assignee: execution.assignee
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('创建测试用例执行记录失败')
      
      return data
    } catch (error) {
      console.error('创建测试用例执行记录失败:', error)
      throw handleSupabaseError(error)
    }
  }

  // 更新执行状态
  static async updateStatus(executionId: number, status: string, actualExecutionTime?: number) {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (actualExecutionTime !== undefined) {
        updateData.actual_execution_time = actualExecutionTime
      }

      const { data, error } = await supabase
        .from(TABLES.TEST_CASE_EXECUTIONS)
        .update(updateData)
        .eq('id', executionId)
        .select()
        .maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error('更新执行状态失败:', error)
      throw handleSupabaseError(error)
    }
  }
}

// 统计服务
export class StatisticsService {
  // 获取仪表板统计数据
  static async getDashboardStats() {
    try {
      const [requirementsResult, plansResult, executionsResult] = await Promise.all([
        supabase.from(TABLES.REQUIREMENTS).select('status', { count: 'exact' }),
        supabase.from(TABLES.TEST_PLANS).select('status, progress', { count: 'exact' }),
        supabase.from(TABLES.TEST_CASE_EXECUTIONS).select('status', { count: 'exact' })
      ])

      if (requirementsResult.error) throw requirementsResult.error
      if (plansResult.error) throw plansResult.error
      if (executionsResult.error) throw executionsResult.error

      return {
        requirements: {
          total: requirementsResult.count || 0,
          pending: requirementsResult.data?.filter(r => r.status === 'pending').length || 0,
          imported: requirementsResult.data?.filter(r => r.status === 'imported').length || 0,
          inProgress: requirementsResult.data?.filter(r => r.status === 'in_progress').length || 0,
          completed: requirementsResult.data?.filter(r => r.status === 'completed').length || 0
        },
        plans: {
          total: plansResult.count || 0,
          draft: plansResult.data?.filter(p => p.status === 'draft').length || 0,
          inProgress: plansResult.data?.filter(p => p.status === 'in_progress').length || 0,
          completed: plansResult.data?.filter(p => p.status === 'completed').length || 0,
          cancelled: plansResult.data?.filter(p => p.status === 'cancelled').length || 0,
          avgProgress: plansResult.data?.reduce((sum, p) => sum + p.progress, 0) / (plansResult.count || 1) || 0
        },
        executions: {
          total: executionsResult.count || 0,
          planned: executionsResult.data?.filter(e => e.status === 'planned').length || 0,
          inProgress: executionsResult.data?.filter(e => e.status === 'in_progress').length || 0,
          completed: executionsResult.data?.filter(e => e.status === 'completed').length || 0,
          skipped: executionsResult.data?.filter(e => e.status === 'skipped').length || 0
        }
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw handleSupabaseError(error)
    }
  }
}
