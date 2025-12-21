import { createClient } from '@supabase/supabase-js'

// Supabase配置 - 在生产环境中需要从环境变量获取
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 创建Supabase客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名常量
export const TABLES = {
  REQUIREMENTS: 'requirements',
  TEST_PLANS: 'test_plans',
  TEST_CASE_EXECUTIONS: 'test_case_executions'
} as const

// 类型定义
export interface Database {
  public: {
    Tables: {
      requirements: {
        Row: {
          id: number
          title: string
          description: string | null
          system: string
          module: string
          priority: 'high' | 'medium' | 'low'
          status: 'pending' | 'imported' | 'in_progress' | 'completed'
          imported_at: string | null
          test_plan_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          system: string
          module: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'pending' | 'imported' | 'in_progress' | 'completed'
          imported_at?: string | null
          test_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          system?: string
          module?: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'pending' | 'imported' | 'in_progress' | 'completed'
          imported_at?: string | null
          test_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_plans: {
        Row: {
          id: number
          plan_id: string
          name: string
          description: string | null
          status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          start_date: string
          end_date: string
          assigned_to: string[] | null
          requirements: string[] | null
          test_cases: any | null
          progress: number
          burndown_data: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          plan_id: string
          name: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          start_date: string
          end_date: string
          assigned_to?: string[] | null
          requirements?: string[] | null
          test_cases?: any | null
          progress?: number
          burndown_data?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          plan_id?: string
          name?: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string
          assigned_to?: string[] | null
          requirements?: string[] | null
          test_cases?: any | null
          progress?: number
          burndown_data?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      test_case_executions: {
        Row: {
          id: number
          test_plan_id: string
          test_case_id: string
          priority: 'high' | 'medium' | 'low'
          expected_execution_time: number
          actual_execution_time: number | null
          status: 'planned' | 'in_progress' | 'completed' | 'skipped'
          assignee: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          test_plan_id: string
          test_case_id: string
          priority?: 'high' | 'medium' | 'low'
          expected_execution_time: number
          actual_execution_time?: number | null
          status?: 'planned' | 'in_progress' | 'completed' | 'skipped'
          assignee?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          test_plan_id?: string
          test_case_id?: string
          priority?: 'high' | 'medium' | 'low'
          expected_execution_time?: number
          actual_execution_time?: number | null
          status?: 'planned' | 'in_progress' | 'completed' | 'skipped'
          assignee?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 错误处理工具函数
export const handleSupabaseError = (error: any) => {
  console.error('Supabase操作失败:', error)
  
  if (error.code === '23505') {
    return '数据已存在，请检查重复性'
  }
  
  if (error.code === '23502') {
    return '必填字段不能为空'
  }
  
  if (error.message) {
    return error.message
  }
  
  return '操作失败，请稍后重试'
}

// 数据验证工具函数
export const validateRequiredFields = (data: any, requiredFields: string[]): string[] => {
  const missingFields: string[] = []
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field)
    }
  })
  
  return missingFields
}

// 导出默认客户端
export default supabase
