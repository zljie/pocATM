import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Download, Upload, Copy, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import type { TestTemplate } from '../types';
import { testTemplates } from '../data/mockData';

interface TemplateManagerProps {
  onClose: () => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ onClose }) => {
  const [templates, setTemplates] = useState<TestTemplate[]>(testTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TestTemplate | null>(null);

  const categories = [
    { value: 'all', label: '全部模板' },
    { value: 'functional', label: '功能测试' },
    { value: 'performance', label: '性能测试' },
    { value: 'security', label: '安全测试' },
    { value: 'api', label: 'API测试' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesKeyword = searchKeyword === '' || 
      template.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      template.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    return matchesCategory && matchesKeyword;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      functional: 'bg-blue-100 text-blue-800',
      performance: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800',
      api: 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleDuplicateTemplate = (template: TestTemplate) => {
    const duplicatedTemplate: TestTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (副本)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  const handleExportTemplate = (template: TestTemplate) => {
    const exportData = {
      ...template,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${template.name.replace(/\\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">测试用例模板管理</h2>
          <p className="text-sm text-muted-foreground mt-1">
            管理和维护测试用例模板，提高测试效率
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Upload className="h-4 w-4 mr-2" />
            导入模板
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建模板
          </Button>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索模板名称、描述或标签..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 模板列表 */}
      <div className="grid gap-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">暂无模板</h3>
              <p className="text-sm text-muted-foreground text-center">
                {searchKeyword || selectedCategory !== 'all' 
                  ? '没有找到符合条件的模板' 
                  : '还没有创建任何模板，点击"新建模板"开始创建'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <Badge className={getCategoryColor(template.category)}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                      {template.isPublic && (
                        <Badge variant="outline">公开</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      包含 {template.steps.length} 个步骤 · 
                      创建于 {template.createdAt.toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportTemplate(template)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* 模板步骤预览 */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">步骤预览</h4>
                  <div className="space-y-2">
                    {template.steps.slice(0, 3).map((step, index) => (
                      <div key={step.id} className="flex items-start gap-2 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs">
                          {step.stepNumber}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{step.description}</p>
                          <p className="text-muted-foreground text-xs">{step.expectedResult}</p>
                        </div>
                      </div>
                    ))}
                    {template.steps.length > 3 && (
                      <p className="text-xs text-muted-foreground ml-7">
                        还有 {template.steps.length - 3} 个步骤...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 统计信息 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{templates.length}</div>
              <div className="text-sm text-muted-foreground">总模板数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {templates.filter(t => t.category === 'functional').length}
              </div>
              <div className="text-sm text-muted-foreground">功能测试</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {templates.filter(t => t.category === 'api').length}
              </div>
              <div className="text-sm text-muted-foreground">API测试</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {templates.filter(t => t.isPublic).length}
              </div>
              <div className="text-sm text-muted-foreground">公开模板</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部操作 */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          关闭
        </Button>
      </div>
    </div>
  );
};