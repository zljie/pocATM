import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Clock, AlertTriangle, CheckCircle, 
  XCircle, BarChart3, Download, Calendar, Target, Lightbulb,
  ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { testReports } from '../data/mockData';
import type { TestReport } from '../types';
import { format, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { exportTestReportToPDF, type ExportData } from '../utils/pdfExport';

interface TestReportDetailProps {
  reportId: string;
  onClose: () => void;
}

export const TestReportDetail: React.FC<TestReportDetailProps> = ({ reportId, onClose }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const reportRef = useRef<HTMLDivElement>(null);
  
  const currentReport = testReports.find(r => r.id === reportId);
  
  // 生成历史数据（模拟）
  const historicalData = useMemo(() => {
    const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const passRate = Math.random() * 30 + 60; // 60-90%的通过率
      const totalTests = Math.floor(Math.random() * 20) + 10;
      const passedTests = Math.floor(totalTests * (passRate / 100));
      const failedTests = totalTests - passedTests;
      
      data.push({
        date: format(date, 'MM-dd'),
        passRate: Math.round(passRate * 10) / 10,
        totalTests,
        passedTests,
        failedTests,
        defects: Math.floor(Math.random() * 5) + 1
      });
    }
    
    return data;
  }, [selectedTimeRange]);

  // 问题模式分析数据
  const problemPatternData = useMemo(() => {
    return [
      { name: '文件上传', count: 15, trend: 'up' },
      { name: '权限验证', count: 12, trend: 'down' },
      { name: '数据验证', count: 10, trend: 'up' },
      { name: 'UI响应', count: 8, trend: 'down' },
      { name: 'API接口', count: 6, trend: 'up' }
    ];
  }, []);

  // 质量改善趋势数据
  const qualityTrendData = useMemo(() => {
    return [
      { period: '第1周', defectCount: 25, regression: 8, newFeature: 12 },
      { period: '第2周', defectCount: 22, regression: 6, newFeature: 10 },
      { period: '第3周', defectCount: 18, regression: 4, newFeature: 8 },
      { period: '第4周', defectCount: 15, regression: 3, newFeature: 6 }
    ];
  }, []);

  // 导出报告功能
  const handleExportPDF = async () => {
    if (!currentReport) return;
    
    setIsExporting(true);
    try {
      const exportData: ExportData = {
        reportName: currentReport.name,
        systemName: currentReport.systemName,
        moduleName: currentReport.moduleName,
        executionDate: format(currentReport.executionDate, 'yyyy-MM-dd HH:mm', { locale: zhCN }),
        totalCases: currentReport.totalCases,
        passedCases: currentReport.passedCases,
        failedCases: currentReport.failedCases,
        passRate: currentReport.passRate,
        summary: currentReport.summary,
        defects: currentReport.defects,
        historicalData: historicalData,
        problemPatterns: problemPatternData
      };
      
      await exportTestReportToPDF(exportData);
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!currentReport) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">报告不存在</h3>
          <p className="text-sm text-muted-foreground">未找到指定的测试报告</p>
          <Button onClick={handleClose} className="mt-4">返回</Button>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div ref={reportRef} className="space-y-6">
      {/* 报告头部信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentReport.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>系统：{currentReport.systemName}</span>
                <span>模块：{currentReport.moduleName}</span>
                <span>执行时间：{format(currentReport.executionDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {isExporting ? '导出中...' : '导出PDF'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClose}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{currentReport.totalCases}</div>
              <div className="text-sm text-muted-foreground">总用例数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{currentReport.passedCases}</div>
              <div className="text-sm text-muted-foreground">通过用例数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{currentReport.failedCases}</div>
              <div className="text-sm text-muted-foreground">失败用例数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{currentReport.passRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">通过率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <div className="w-full">
        {/* 标签页导航 */}
        <div className="grid w-full grid-cols-4 bg-muted p-1 rounded-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'overview' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Target className="h-4 w-4" />
            概览
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'history' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="h-4 w-4" />
            历史分析
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={cn(
              "flex items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'patterns' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            问题模式
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={cn(
              "flex items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'suggestions' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Lightbulb className="h-4 w-4" />
            改进建议
          </button>
        </div>

        {/* 标签页内容 */}
        <div className="mt-6">
          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 执行状态分布 */}
                <Card>
                  <CardHeader>
                    <CardTitle>执行状态分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: '通过', value: currentReport.passedCases, color: '#22C55E' },
                            { name: '失败', value: currentReport.failedCases, color: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {[
                            { name: '通过', value: currentReport.passedCases, color: '#22C55E' },
                            { name: '失败', value: currentReport.failedCases, color: '#EF4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* 缺陷统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle>缺陷统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentReport.defects.map((defect) => (
                        <div key={defect.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={defect.severity === 'high' ? 'destructive' : defect.severity === 'medium' ? 'default' : 'secondary'}>
                                {defect.severity === 'high' ? '高' : defect.severity === 'medium' ? '中' : '低'}
                              </Badge>
                              <Badge variant={defect.status === 'open' ? 'destructive' : defect.status === 'in-progress' ? 'default' : 'secondary'}>
                                {defect.status === 'open' ? '开放' : defect.status === 'in-progress' ? '处理中' : '已解决'}
                              </Badge>
                            </div>
                            <h4 className="font-medium">{defect.title}</h4>
                            <p className="text-sm text-muted-foreground">{defect.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 历史分析标签页 */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>历史执行趋势</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant={selectedTimeRange === '7d' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setSelectedTimeRange('7d')}
                      >
                        7天
                      </Button>
                      <Button 
                        variant={selectedTimeRange === '30d' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setSelectedTimeRange('30d')}
                      >
                        30天
                      </Button>
                      <Button 
                        variant={selectedTimeRange === '90d' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setSelectedTimeRange('90d')}
                      >
                        90天
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="passRate" stroke="#8884d8" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="totalTests" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>测试数量趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="passedTests" stackId="1" stroke="#22C55E" fill="#22C55E" />
                        <Area type="monotone" dataKey="failedTests" stackId="1" stroke="#EF4444" fill="#EF4444" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>缺陷发现趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="defects" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 问题模式标签页 */}
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-blue-800">问题模式分析</h3>
                <p className="text-sm text-blue-600">识别反复出现问题的测试用例和高频失败的功能模块</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>高频问题类型</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={problemPatternData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8">
                          {problemPatternData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>问题趋势分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {problemPatternData.map((pattern, index) => (
                        <div key={pattern.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{pattern.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">出现 {pattern.count} 次</span>
                            {pattern.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>质量改善趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={qualityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="defectCount" stroke="#EF4444" strokeWidth={2} name="缺陷数量" />
                      <Line type="monotone" dataKey="regression" stroke="#F59E0B" strokeWidth={2} name="回归缺陷" />
                      <Line type="monotone" dataKey="newFeature" stroke="#3B82F6" strokeWidth={2} name="新功能缺陷" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 改进建议标签页 */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      质量改进建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">优化建议</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 加强文件上传功能的测试覆盖</li>
                          <li>• 完善权限验证机制</li>
                          <li>• 优化API接口响应时间</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">风险预警</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 高并发场景下的性能问题</li>
                          <li>• 数据一致性需要加强验证</li>
                          <li>• 异常处理机制待完善</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      目标设定
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">下个版本通过率目标</div>
                          <div className="text-sm text-muted-foreground">当前：{currentReport.passRate.toFixed(1)}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">≥95%</div>
                          <div className="text-xs text-muted-foreground">目标</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">缺陷收敛时间</div>
                          <div className="text-sm text-muted-foreground">预计修复时间</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">7天</div>
                          <div className="text-xs text-muted-foreground">内解决</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">测试覆盖度</div>
                          <div className="text-sm text-muted-foreground">当前覆盖水平</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">85%</div>
                          <div className="text-xs text-muted-foreground">覆盖率</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    后续行动计划
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">短期行动（1-2周）</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• 修复高优先级缺陷</li>
                          <li>• 完善自动化测试用例</li>
                          <li>• 加强回归测试</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">中期改进（3-4周）</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• 优化测试流程</li>
                          <li>• 建立质量监控体系</li>
                          <li>• 提升测试效率</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">长期规划（1-3个月）</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• 构建完整的质量管理体系</li>
                          <li>• 实现持续集成/持续部署</li>
                          <li>• 提升团队测试能力</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};