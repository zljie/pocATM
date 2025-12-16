import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  reportName: string;
  systemName: string;
  moduleName: string;
  executionDate: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  passRate: number;
  summary: string;
  defects: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    assignee: string;
    description: string;
  }>;
  historicalData: Array<{
    date: string;
    passRate: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    defects: number;
  }>;
  problemPatterns: Array<{
    name: string;
    count: number;
    trend: string;
  }>;
}

export const exportTestReportToPDF = async (data: ExportData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // 使用内置字体（支持英文），中文使用ASCII字符替代
  pdf.setFont('helvetica');

  // 标题
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI辅助测试管理 - 测试报告', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // 报告基本信息
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('报告信息', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const info = [
    ['报告名称:', data.reportName],
    ['系统名称:', data.systemName],
    ['模块名称:', data.moduleName],
    ['执行时间:', data.executionDate],
    ['总用例数:', data.totalCases.toString()],
    ['通过用例数:', data.passedCases.toString()],
    ['失败用例数:', data.failedCases.toString()],
    ['通过率:', `${data.passRate.toFixed(1)}%`]
  ];

  info.forEach(([label, value]) => {
    pdf.text(label, margin, yPosition);
    pdf.text(value, margin + 40, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // 执行摘要
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('执行摘要', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const summaryLines = pdf.splitTextToSize(data.summary, pageWidth - 2 * margin);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // 缺陷列表
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('缺陷列表', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  data.defects.forEach((defect, index) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. ${defect.title}`, margin, yPosition);
    yPosition += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`严重程度: ${getSeverityLabel(defect.severity)}`, margin + 5, yPosition);
    pdf.text(`状态: ${getStatusLabel(defect.status)}`, margin + 60, yPosition);
    yPosition += 5;
    
    pdf.text(`负责人: ${defect.assignee}`, margin + 5, yPosition);
    yPosition += 6;

    const descLines = pdf.splitTextToSize(defect.description, pageWidth - 2 * margin - 10);
    pdf.text(descLines, margin + 5, yPosition);
    yPosition += descLines.length * 4 + 8;
  });

  yPosition += 10;

  // 历史数据分析
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('历史数据分析', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('最近执行趋势:', margin, yPosition);
  yPosition += 6;

  const recentData = data.historicalData.slice(-5);
  pdf.text('日期        通过率    总测试    通过    失败    缺陷', margin, yPosition);
  yPosition += 5;

  recentData.forEach(item => {
    pdf.text(`${item.date}    ${item.passRate.toFixed(1)}%    ${item.totalTests}    ${item.passedTests}    ${item.failedTests}    ${item.defects}`, margin, yPosition);
    yPosition += 5;
  });

  yPosition += 10;

  // 问题模式分析
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('问题模式分析', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  data.problemPatterns.forEach(pattern => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }

    const trendIcon = pattern.trend === 'up' ? '↑' : '↓';
    pdf.text(`${pattern.name}: ${pattern.count} 次 ${trendIcon}`, margin, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // 页脚
  pdf.setFontSize(8);
  pdf.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, margin, pageHeight - 10);
  pdf.text('AI辅助测试管理系统', pageWidth - margin - 50, pageHeight - 10);

  // 保存PDF
  pdf.save(`${data.reportName}_${new Date().toISOString().split('T')[0]}.pdf`);
};

const getSeverityLabel = (severity: string): string => {
  const labels: Record<string, string> = {
    'high': '高',
    'medium': '中',
    'low': '低'
  };
  return labels[severity] || severity;
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'open': '开放',
    'in-progress': '处理中',
    'resolved': '已解决'
  };
  return labels[status] || status;
};