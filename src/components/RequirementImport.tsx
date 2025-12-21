import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Search, Download, Filter } from 'lucide-react';
import { Requirement } from '../types';
import { systemModules } from '../data/mockData';

interface RequirementImportProps {
  onImport: (requirements: Requirement[]) => void;
}

export const RequirementImport: React.FC<RequirementImportProps> = ({ onImport }) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState<Set<string>>(new Set());

  // 模拟需求数据
  const requirements: Requirement[] = [
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

  // 获取系统列表
  const systems = systemModules.map(system => ({
    id: system.id,
    name: system.name
  }));

  // 获取模块列表（根据选中的系统）
  const getModules = () => {
    const system = systemModules.find(s => s.id === selectedSystem);
    return system?.children?.map(module => ({
      id: module.id,
      name: module.name
    })) || [];
  };

  // 过滤需求
  const filteredRequirements = requirements.filter(req => {
    const matchesSystem = !selectedSystem || req.system === systems.find(s => s.id === selectedSystem)?.name;
    const matchesModule = !selectedModule || req.module === getModules().find(m => m.id === selectedModule)?.name;
    const matchesKeyword = !searchKeyword || 
      req.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      req.description.toLowerCase().includes(searchKeyword.toLowerCase());
    
    return matchesSystem && matchesModule && matchesKeyword;
  });

  // 处理选择
  const handleSelectRequirement = (requirementId: string, checked: boolean) => {
    const newSelected = new Set(selectedRequirements);
    if (checked) {
      newSelected.add(requirementId);
    } else {
      newSelected.delete(requirementId);
    }
    setSelectedRequirements(newSelected);
  };

  // 处理导入
  const handleImport = () => {
    const selectedReqs = requirements.filter(req => selectedRequirements.has(req.id));
    onImport(selectedReqs);
    setShowImportDialog(false);
    setSelectedRequirements(new Set());
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

  return (
    <>
      <Button onClick={() => setShowImportDialog(true)} className="gap-2">
        <Download className="h-4 w-4" />
        导入需求
      </Button>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>需求导入</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            {/* 筛选条件 */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">系统选择</label>
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择系统" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map(system => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">模块选择</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择模块" />
                  </SelectTrigger>
                  <SelectContent>
                    {getModules().map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 block">搜索关键词</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索需求标题或描述"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* 需求列表 */}
            <ScrollArea className="flex-1 border rounded">
              <div className="p-4 space-y-3">
                {filteredRequirements.map(req => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50">
                    <Checkbox
                      checked={selectedRequirements.has(req.id)}
                      onCheckedChange={(checked) => handleSelectRequirement(req.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{req.title}</h4>
                        <Badge variant="secondary" className={getPriorityColor(req.priority)}>
                          {getPriorityText(req.priority)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {req.system} / {req.module}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {req.description}
                      </p>
                    </div>
                  </div>
                ))}
                
                {filteredRequirements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无符合条件的需求
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* 底部操作栏 */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                已选择 {selectedRequirements.size} 个需求
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={selectedRequirements.size === 0}
                >
                  导入选中的需求
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
