import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Brain, CheckCircle, AlertCircle, TrendingUp, Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import type { AIAnalysis, FunctionSubmission } from '../types';
import { systemModules } from '../data/mockData';

interface FunctionSubmissionFormProps {
  onSubmit: (data: Partial<FunctionSubmission>) => void;
  onCancel: () => void;
  initialData?: Partial<FunctionSubmission>;
}

export const FunctionSubmissionForm: React.FC<FunctionSubmissionFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    functionId: initialData?.functionId || '',
    systemName: initialData?.systemName || '',
    moduleName: initialData?.moduleName || '',
    description: initialData?.description || '',
    acceptanceCriteria: initialData?.acceptanceCriteria || '',
    usageProcess: initialData?.usageProcess || '',
    status: initialData?.status || 'pending' as const
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(initialData?.aiAnalysis || null);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const systems = [...new Set(systemModules.map(m => m.name))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length > 5) {
      setErrorMsg('最多只能上传 5 张图片');
      return;
    }
    onSubmit({ ...formData, images });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 当描述性字段发生变化时，触发AI分析
    if (field === 'description' || field === 'acceptanceCriteria' || field === 'usageProcess') {
      const updatedData = { ...formData, [field]: value };
      if (updatedData.description || updatedData.acceptanceCriteria) {
        triggerAIAnalysis(updatedData);
      }
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    const existing = images.length;
    const toAddCount = Math.min(5 - existing, files.length);
    if (existing >= 5) {
      setErrorMsg('已达到 5 张上限');
      return;
    }
    const next: string[] = [];
    for (let i = 0; i < toAddCount; i++) {
      const f = files[i];
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(f);
      });
      next.push(dataUrl);
    }
    setImages(prev => [...prev, ...next]);
    if (existing + toAddCount < files.length) {
      setErrorMsg(`已选择 ${files.length} 张，超过上限，仅添加了 ${toAddCount} 张`);
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const clearImages = () => {
    setImages([]);
    setErrorMsg(null);
  };

  const triggerAIAnalysis = async (data: typeof formData) => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    setTimeout(() => {
      const mockAnalysis: AIAnalysis = {
        completeness: Math.floor(Math.random() * 30) + 70, // 70-100
        clarity: Math.floor(Math.random() * 25) + 75, // 75-100
        suggestions: [
          '建议补充用户角色定义',
          '可以添加异常情况的处理说明',
          '建议明确性能要求',
          '建议增加安全性相关要求'
        ],
        testScenarios: [
          '正常业务场景验证',
          '边界条件测试',
          '异常情况处理',
          '权限验证测试',
          '性能压力测试'
        ],
        potentialIssues: [
          '未明确数据验证规则',
          '缺乏错误处理机制',
          '界面响应时间要求不明确',
          '权限控制描述不够详细'
        ],
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100
      };
      
      setAiAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getCompletenessColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletenessBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* 表单主体 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            功能提测信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">功能编号</label>
                <Input
                  value={formData.functionId}
                  onChange={(e) => handleInputChange('functionId', e.target.value)}
                  placeholder="请输入功能编号"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">系统名称</label>
                <Select value={formData.systemName} onValueChange={(value) => handleInputChange('systemName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择系统" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map(system => (
                      <SelectItem key={system} value={system}>{system}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">模块名称</label>
              <Input
                value={formData.moduleName}
                onChange={(e) => handleInputChange('moduleName', e.target.value)}
                placeholder="请输入模块名称"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">功能介绍</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="请详细描述功能的作用、目标和应用场景"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">验收标准</label>
              <Textarea
                value={formData.acceptanceCriteria}
                onChange={(e) => handleInputChange('acceptanceCriteria', e.target.value)}
                placeholder="请描述功能的验收标准和质量要求"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">使用流程描述</label>
              <Textarea
                value={formData.usageProcess}
                onChange={(e) => handleInputChange('usageProcess', e.target.value)}
                placeholder="请描述用户使用该功能的具体流程"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">功能说明图片（最多 5 张）</label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">选择图片</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                      disabled={images.length >= 5}
                    />
                  </label>
                  <Button type="button" variant="outline" onClick={clearImages} className="gap-2">
                    <X className="h-4 w-4" />
                    清空
                  </Button>
                  <span className="text-xs text-muted-foreground">已选择 {images.length}/5</span>
                </div>
                {errorMsg && (
                  <div className="text-xs text-red-600">{errorMsg}</div>
                )}
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative border rounded overflow-hidden">
                        <img src={src} alt={`上传图片 ${idx + 1}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded p-1"
                          aria-label="删除图片"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length === 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ImageIcon className="h-4 w-4" />
                    暂无已选择的图片
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                提交提测申请
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* AI分析结果 */}
      {(isAnalyzing || aiAnalysis) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI分析结果
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  AI正在分析中...
                </div>
              )}
            </CardTitle>
          </CardHeader>
          {aiAnalysis && (
            <CardContent className="space-y-6">
              {/* 质量评分 */}
              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "p-4 rounded-lg border",
                  getCompletenessBg(aiAnalysis.completeness)
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">需求完整性</span>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className={cn("text-2xl font-bold", getCompletenessColor(aiAnalysis.completeness))}>
                    {aiAnalysis.completeness}%
                  </div>
                </div>
                
                <div className={cn(
                  "p-4 rounded-lg border",
                  getCompletenessBg(aiAnalysis.clarity)
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">表达清晰度</span>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className={cn("text-2xl font-bold", getCompletenessColor(aiAnalysis.clarity))}>
                    {aiAnalysis.clarity}%
                  </div>
                </div>
              </div>

              {/* 建议 */}
              <div>
                <h4 className="font-medium mb-3">改进建议</h4>
                <div className="space-y-2">
                  {aiAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 测试场景 */}
              <div>
                <h4 className="font-medium mb-3">建议的测试场景</h4>
                <div className="grid grid-cols-2 gap-2">
                  {aiAnalysis.testScenarios.map((scenario, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      {scenario}
                    </div>
                  ))}
                </div>
              </div>

              {/* 潜在问题 */}
              <div>
                <h4 className="font-medium mb-3 text-red-600">潜在问题</h4>
                <div className="space-y-2">
                  {aiAnalysis.potentialIssues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI置信度 */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-800">AI分析置信度</span>
                <span className="text-sm font-bold text-blue-600">{aiAnalysis.confidence}%</span>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};
