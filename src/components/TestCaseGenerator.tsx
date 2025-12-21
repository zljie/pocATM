import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Brain, Wand2, Download, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { TestCase, AIGenerationResult } from '../types';
import { generateId } from '../lib/utils';

interface TestCaseGeneratorProps {
  functionDescription: string;
  acceptanceCriteria: string;
  usageProcess: string;
  onGenerate: (testCases: Partial<TestCase>[]) => void;
  onClose: () => void;
}

export const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({
  functionDescription,
  acceptanceCriteria,
  usageProcess,
  onGenerate,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<Partial<TestCase>[]>([]);
  const [outputFormat, setOutputFormat] = useState<'function' | 'api'>('function');
  const [generationOptions, setGenerationOptions] = useState({
    includeNegativeTests: true,
    includeEdgeCases: true,
    includePerformanceTests: false,
    includeSecurityTests: false
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      const mockGeneratedCases: Partial<TestCase>[] = [
        {
          id: generateId(),
          testCaseId: `TC-${Date.now().toString().slice(-6)}-01`,
          description: '正常业务流程验证',
          steps: [
            '打开功能页面',
            '输入有效的业务数据',
            '执行主要操作',
            '验证操作结果'
          ],
          expectedResult: '功能正常执行，结果符合预期',
          priority: 'high',
          status: 'draft',
          aiGenerated: true
        },
        {
          id: generateId(),
          testCaseId: `TC-${Date.now().toString().slice(-6)}-02`,
          description: '数据验证测试',
          steps: [
            '输入无效或空数据',
            '尝试提交表单',
            '查看验证错误提示'
          ],
          expectedResult: '系统应显示明确的错误提示，不允许提交',
          priority: 'high',
          status: 'draft',
          aiGenerated: true
        },
        {
          id: generateId(),
          testCaseId: `TC-${Date.now().toString().slice(-6)}-03`,
          description: '边界条件测试',
          steps: [
            '输入最大/最小允许值',
            '执行操作',
            '验证结果正确性'
          ],
          expectedResult: '边界值处理正确，无异常',
          priority: 'medium',
          status: 'draft',
          aiGenerated: true
        },
        {
          id: generateId(),
          testCaseId: `TC-${Date.now().toString().slice(-6)}-04`,
          description: '异常情况处理',
          steps: [
            '模拟网络异常',
            '执行操作',
            '验证异常处理机制'
          ],
          expectedResult: '异常情况得到妥善处理，用户体验良好',
          priority: 'medium',
          status: 'draft',
          aiGenerated: true
        }
      ];

      if (generationOptions.includeNegativeTests) {
        mockGeneratedCases.push({
          id: generateId(),
          testCaseId: `TC-${Date.now().toString().slice(-6)}-05`,
          description: '负向测试用例',
          steps: [
            '输入特殊字符或格式',
            '尝试绕过验证',
            '检查安全措施'
          ],
          expectedResult: '系统能够识别并拒绝恶意输入',
          priority: 'high',
          status: 'draft',
          aiGenerated: true
        });
      }

      setGeneratedCases(mockGeneratedCases);
      setIsGenerating(false);
    }, 3000);
  };

  const handleExport = () => {
    const exportData = {
      functionDescription,
      acceptanceCriteria,
      usageProcess,
      testCases: generatedCases,
      generatedAt: new Date().toISOString(),
      format: outputFormat
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-cases-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = outputFormat === 'function' 
      ? formatAsGherkin(generatedCases)
      : formatAsTable(generatedCases);
    
    navigator.clipboard.writeText(text);
  };

  const formatAsGherkin = (cases: Partial<TestCase>[]) => {
    return cases.map(testCase => {
      return `Feature: ${testCase.description}

  Scenario: ${testCase.description}
    Given 准备测试环境
    When  ${testCase.steps?.[0] || '执行测试步骤'}
    ${testCase.steps?.slice(1).map(step => `    And   ${step}`).join('\n') || ''}
    Then  验证结果: ${testCase.expectedResult}`;
    }).join('\n\n');
  };

  const formatAsTable = (cases: Partial<TestCase>[]) => {
    const headers = ['测试用例ID', '描述', '测试步骤', '期望结果', '优先级'];
    const rows = cases.map(testCase => [
      testCase.testCaseId || '',
      testCase.description || '',
      (testCase.steps || []).join('\n'),
      testCase.expectedResult || '',
      testCase.priority || ''
    ]);

    return [headers, ...rows].map(row => row.join('\t')).join('\n');
  };

  return (
    <div className="space-y-6">
      {/* 配置面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            测试用例生成配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">转化模版</label>
              <Select value={outputFormat} onValueChange={(value: 'function' | 'api') => setOutputFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="function">功能测试</SelectItem>
                  <SelectItem value="api">API测试</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    AI生成中...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    生成测试用例
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">生成选项</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generationOptions.includeNegativeTests}
                  onChange={(e) => setGenerationOptions(prev => ({
                    ...prev,
                    includeNegativeTests: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm">包含负向测试用例</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generationOptions.includeEdgeCases}
                  onChange={(e) => setGenerationOptions(prev => ({
                    ...prev,
                    includeEdgeCases: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm">包含边界条件测试</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generationOptions.includePerformanceTests}
                  onChange={(e) => setGenerationOptions(prev => ({
                    ...prev,
                    includePerformanceTests: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm">包含性能测试</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generationOptions.includeSecurityTests}
                  onChange={(e) => setGenerationOptions(prev => ({
                    ...prev,
                    includeSecurityTests: e.target.checked
                  }))}
                  className="rounded"
                />
                <span className="text-sm">包含安全测试</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 生成结果 */}
      {generatedCases.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                生成的测试用例 ({generatedCases.length}个)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button size="sm" onClick={() => onGenerate(generatedCases)}>
                  保存用例
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedCases.map((testCase, index) => (
                <div key={testCase.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{testCase.testCaseId}</h4>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      testCase.priority === 'high' ? "bg-red-100 text-red-800" :
                      testCase.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {testCase.priority === 'high' ? '高优先级' :
                       testCase.priority === 'medium' ? '中优先级' : '低优先级'}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{testCase.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">测试步骤:</span>
                        <ol className="text-sm mt-1 space-y-1">
                          {testCase.steps?.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex gap-2">
                              <span className="text-muted-foreground">{stepIndex + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">期望结果:</span>
                        <p className="text-sm mt-1">{testCase.expectedResult}</p>
                      </div>
                    </div>
                  </div>
                  
                  {testCase.aiGenerated && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <Brain className="h-3 w-3" />
                      AI生成
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 输入信息预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            输入信息预览
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">功能描述</label>
            <p className="text-sm mt-1 p-3 bg-muted rounded">{functionDescription}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">验收标准</label>
            <p className="text-sm mt-1 p-3 bg-muted rounded">{acceptanceCriteria}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">使用流程</label>
            <p className="text-sm mt-1 p-3 bg-muted rounded">{usageProcess}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          关闭
        </Button>
      </div>
    </div>
  );
};
