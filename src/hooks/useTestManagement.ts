import { useState, useEffect, useCallback } from 'react'
import { RequirementsService, TestPlansService } from '../services/database'
import type { Requirement, TestPlan } from '../types'

// 需求数据Hook
export function useRequirements() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有需求
  const fetchRequirements = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await RequirementsService.getAll()
      setRequirements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取需求列表失败')
      // 在开发阶段，如果没有数据库连接，使用模拟数据
      console.warn('使用模拟数据 - Supabase连接不可用')
      import('../data/mockData').then(({ requirements: mockRequirements }) => {
        setRequirements(mockRequirements)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // 导入需求到测试计划
  const importRequirements = useCallback(async (requirementIds: string[], testPlanId: string) => {
    try {
      await RequirementsService.importToTestPlan(requirementIds, testPlanId)
      // 更新本地状态
      setRequirements(prev => prev.map(req => 
        requirementIds.includes(req.id) 
          ? { ...req, status: 'imported' as const, importedAt: new Date(), testPlanId }
          : req
      ))
    } catch (err) {
      console.warn('导入需求失败，使用本地更新:', err)
      // 即使数据库操作失败，也更新本地状态以保持UI一致性
      setRequirements(prev => prev.map(req => 
        requirementIds.includes(req.id) 
          ? { ...req, status: 'imported' as const, importedAt: new Date(), testPlanId }
          : req
      ))
    }
  }, [])

  useEffect(() => {
    fetchRequirements()
  }, [fetchRequirements])

  return {
    requirements,
    loading,
    error,
    fetchRequirements,
    importRequirements,
    setRequirements
  }
}

// 测试计划数据Hook
export function useTestPlans() {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有测试计划
  const fetchTestPlans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await TestPlansService.getAll()
      setTestPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取测试计划列表失败')
      // 在开发阶段，如果没有数据库连接，使用模拟数据
      console.warn('使用模拟数据 - Supabase连接不可用')
      import('../data/mockData').then(({ testPlans: mockTestPlans }) => {
        setTestPlans(mockTestPlans)
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建新测试计划
  const createTestPlan = useCallback(async (planData: Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // 生成唯一ID
      const newPlan: TestPlan = {
        ...planData,
        id: `PLAN-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // 尝试保存到数据库
      const savedPlan = await TestPlansService.create(newPlan)
      setTestPlans(prev => [savedPlan, ...prev])
      
      return savedPlan
    } catch (err) {
      console.warn('创建测试计划失败，使用本地创建:', err)
      // 即使数据库操作失败，也添加本地记录以保持UI一致性
      const newPlan: TestPlan = {
        ...planData,
        id: `PLAN-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setTestPlans(prev => [newPlan, ...prev])
      return newPlan
    }
  }, [])

  // 更新测试计划
  const updateTestPlan = useCallback(async (planId: string, updates: Partial<TestPlan>) => {
    try {
      const updatedPlan = await TestPlansService.update(planId, updates)
      setTestPlans(prev => prev.map(plan => 
        plan.id === planId ? updatedPlan : plan
      ))
      return updatedPlan
    } catch (err) {
      console.warn('更新测试计划失败，使用本地更新:', err)
      // 即使数据库操作失败，也更新本地状态
      setTestPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...updates, updatedAt: new Date() } : plan
      ))
    }
  }, [])

  // 更新进度
  const updateProgress = useCallback(async (planId: string, progress: number) => {
    try {
      await TestPlansService.updateProgress(planId, progress)
      setTestPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, progress, updatedAt: new Date() } : plan
      ))
    } catch (err) {
      console.warn('更新进度失败，使用本地更新:', err)
      setTestPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, progress, updatedAt: new Date() } : plan
      ))
    }
  }, [])

  useEffect(() => {
    fetchTestPlans()
  }, [fetchTestPlans])

  return {
    testPlans,
    loading,
    error,
    fetchTestPlans,
    createTestPlan,
    updateTestPlan,
    updateProgress,
    setTestPlans
  }
}

// 组合Hook用于管理所有数据
export function useTestManagement() {
  const requirementsHook = useRequirements()
  const testPlansHook = useTestPlans()

  // 同步刷新所有数据
  const refreshAll = useCallback(async () => {
    await Promise.all([
      requirementsHook.fetchRequirements(),
      testPlansHook.fetchTestPlans()
    ])
  }, [requirementsHook.fetchRequirements, testPlansHook.fetchTestPlans])

  return {
    // 需求数据
    requirements: requirementsHook.requirements,
    requirementsLoading: requirementsHook.loading,
    requirementsError: requirementsHook.error,
    importRequirements: requirementsHook.importRequirements,
    fetchRequirements: requirementsHook.fetchRequirements,
    setRequirements: requirementsHook.setRequirements,

    // 测试计划数据
    testPlans: testPlansHook.testPlans,
    testPlansLoading: testPlansHook.loading,
    testPlansError: testPlansHook.error,
    createTestPlan: testPlansHook.createTestPlan,
    updateTestPlan: testPlansHook.updateTestPlan,
    updateProgress: testPlansHook.updateProgress,
    fetchTestPlans: testPlansHook.fetchTestPlans,
    setTestPlans: testPlansHook.setTestPlans,

    // 通用操作
    refreshAll
  }
}
