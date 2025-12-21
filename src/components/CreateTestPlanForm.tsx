import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, Users, Target } from 'lucide-react';

interface CreateTestPlanFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateTestPlanForm: React.FC<CreateTestPlanFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    requirements: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedHours: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 数据验证
    if (!formData.name.trim()) {
      alert('请输入计划名称');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      alert('请选择开始和结束日期');
      return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('结束日期必须晚于开始日期');
      return;
    }

    // 转换数据格式
    const planData = {
      name: formData.name,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      assignedTo: formData.assignedTo.split(',').map(name => name.trim()).filter(name => name),
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
      priority: formData.priority,
      estimatedHours: formData.estimatedHours,
      status: 'draft' as const,
      progress: 0,
      testCases: [],
      burndownData: []
    };

    onSubmit(planData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* 计划名称 */}
        <div className="col-span-2">
          <label className="text-sm font-medium mb-2 block">
            计划名称 <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="请输入测试计划名称"
            required
          />
        </div>

        {/* 计划描述 */}
        <div className="col-span-2">
          <label className="text-sm font-medium mb-2 block">计划描述</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="请输入测试计划详细描述"
            rows={3}
          />
        </div>

        {/* 开始日期 */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            开始日期 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* 结束日期 */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            结束日期 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* 负责人 */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            <Users className="inline h-4 w-4 mr-1" />
            负责人
          </label>
          <Input
            value={formData.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            placeholder="张三,李四,王五（用逗号分隔）"
          />
        </div>

        {/* 优先级 */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            <Target className="inline h-4 w-4 mr-1" />
            优先级
          </label>
          <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">高优先级</SelectItem>
              <SelectItem value="medium">中优先级</SelectItem>
              <SelectItem value="low">低优先级</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 预计工时 */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            <Clock className="inline h-4 w-4 mr-1" />
            预计工时（小时）
          </label>
          <Input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.5"
          />
        </div>

        {/* 关联需求 */}
        <div>
          <label className="text-sm font-medium mb-2 block">关联需求</label>
          <Input
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            placeholder="REQ-001,REQ-002（需求ID，用逗号分隔）"
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" className="px-8">
          创建计划
        </Button>
      </div>
    </form>
  );
};
