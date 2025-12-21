import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BurndownPoint } from '../types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BurndownChartProps {
  data: BurndownPoint[];
  title?: string;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({ data, title = '燃尽图' }) => {
  // 格式化日期显示
  const formatDate = (date: Date) => {
    return format(date, 'MM-dd', { locale: zhCN });
  };

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const toDate = (v: any) => {
        if (v instanceof Date) return v as Date;
        if (typeof v === 'string') return parseISO(v as string);
        return new Date(v as number);
      };
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium text-sm">{`日期: ${formatDate(toDate(label))}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)} 小时`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 } as any}
            />
            <YAxis
              label={{ value: '工作量 (小时)', angle: -90, position: 'insideLeft' } as any}
              tick={{ fontSize: 12 } as any}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="plannedWorkload"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2 } as any}
              name="计划工作量"
            />
            <Line
              type="monotone"
              dataKey="actualWorkload"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ fill: '#82ca9d', strokeWidth: 2 } as any}
              name="实际工作量"
            />
            <Line
              type="monotone"
              dataKey="completedWorkload"
              stroke="#ffc658"
              strokeWidth={2}
              dot={{ fill: '#ffc658', strokeWidth: 2 } as any}
              name="已完成工作量"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* 手动图例 */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#8884d8]"></div>
          <span>计划工作量</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#82ca9d]"></div>
          <span>实际工作量</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#ffc658]"></div>
          <span>已完成工作量</span>
        </div>
      </div>
      
      {/* 图例说明 */}
      <div className="mt-4 text-xs text-muted-foreground">
        <p>• 计划工作量：理想情况下的工作量消耗</p>
        <p>• 实际工作量：实际工作量的消耗进度</p>
        <p>• 已完成工作量：实际已完成的工作量</p>
      </div>
    </div>
  );
};
