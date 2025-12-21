import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BurndownChart } from './BurndownChart';
import { TestPlan } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { User, Calendar, Clock, Target } from 'lucide-react';

interface TestPlanDetailProps {
  testPlan: TestPlan;
  onClose?: () => void;
}

export const TestPlanDetail: React.FC<TestPlanDetailProps> = ({ testPlan, onClose }) => {
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'in_progress': return '执行中';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  // 获取用例状态颜色
  const getCaseStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'skipped': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取用例状态文本
  const getCaseStatusText = (status: string) => {
    switch (status) {
      case 'planned': return '计划中';
      case 'in_progress': return '执行中';
      case 'completed': return '已完成';
      case 'skipped': return '已跳过';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{testPlan.name}</h2>
              <p className="text-muted-foreground">{testPlan.description}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(testPlan.status)}>
              {getStatusText(testPlan.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">开始时间</p>
                <p className="font-medium">{format(testPlan.startDate, 'yyyy-MM-dd', { locale: zhCN })}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">结束时间</p>
                <p className="font-medium">{format(testPlan.endDate, 'yyyy-MM-dd', { locale: zhCN })}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">负责人</p>
                <p className="font-medium">{testPlan.assignedTo.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">完成进度</p>
                <div className="flex items-center gap-2">
                  <Progress value={testPlan.progress} className="w-16" />
                  <span className="text-sm font-medium">{testPlan.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 关联需求 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">关联需求</h3>
        <div className="space-y-2">
          {testPlan.requirements.map(reqId => (
            <div key={reqId} className="flex items-center justify-between p-3 border rounded">
              <span className="font-medium">{reqId}</span>
              <Badge variant="outline">已关联</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* 测试用例列表 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">测试用例执行情况</h3>
        <div className="space-y-3">
          {testPlan.testCases.map((testCase, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{testCase.testCaseId}</span>
                  <Badge variant="secondary" className={getPriorityColor(testCase.priority)}>
                    {getPriorityText(testCase.priority)}
                  </Badge>
                  <Badge variant="secondary" className={getCaseStatusColor(testCase.status)}>
                    {getCaseStatusText(testCase.status)}
                  </Badge>
                  {testCase.assignee && (
                    <span className="text-sm text-muted-foreground">执行人: {testCase.assignee}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>预计: {testCase.expectedExecutionTime}h</span>
                  </div>
                  {testCase.actualExecutionTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>实际: {testCase.actualExecutionTime}h</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 燃尽图 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">燃尽图</h3>
        <BurndownChart 
          data={testPlan.burndownData || []} 
          title={`${testPlan.name} - 燃尽图`}
        />
      </div>
    </div>
  );
};
