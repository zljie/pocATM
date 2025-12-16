// 解决Recharts类型问题的全局声明
declare module 'recharts' {
  import { ComponentType } from 'react';
  
  export interface ResponsiveContainerProps {
    width?: string | number;
    height?: string | number;
    aspect?: number;
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
    debounce?: number;
    children?: React.ReactNode;
    onResize?: (entry: DOMRectReadOnly) => void;
  }
  
  export const ResponsiveContainer: ComponentType<ResponsiveContainerProps>;
  
  export interface LineChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: React.ReactNode;
  }
  
  export const LineChart: ComponentType<LineChartProps>;
  
  export interface BarChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: React.ReactNode;
  }
  
  export const BarChart: ComponentType<BarChartProps>;
  
  export interface PieChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: React.ReactNode;
  }
  
  export const PieChart: ComponentType<PieChartProps>;
  
  export interface AreaChartProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: React.ReactNode;
  }
  
  export const AreaChart: ComponentType<AreaChartProps>;
  
  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeRange?: number;
    fill?: string;
    fillOpacity?: number;
    fillRange?: number;
  }
  
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  
  export interface XAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    allowDataOverflow?: boolean;
    allowDuplicatedCategory?: boolean;
    allowDecimals?: boolean;
    allowEvents?: boolean;
    allowMargin?: boolean;
    axisLine?: boolean;
    tick?: boolean;
    tickLine?: boolean;
    tickFormatter?: (value: any, index: number) => string;
    tickMargin?: number;
    tickMaxRotation?: number;
    tickMinRotation?: number;
    tickMirror?: boolean;
    tickSize?: number;
    ticks?: any[];
    ticksGenerator?: (domain: any) => any[];
    tickSpacing?: number;
    tickValueFormatter?: (value: any, index: number) => string;
    unit?: string | number;
    name?: string | number;
    domain?: any;
    scale?: string;
    width?: number;
    height?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    orientation?: 'bottom' | 'top';
    yAxisId?: string | number;
    reversed?: boolean;
    label?: string | number | React.ReactNode;
    scaleToFit?: boolean;
    tickCount?: number;
  }
  
  export const XAxis: ComponentType<XAxisProps>;
  
  export interface YAxisProps {
    dataKey?: string;
    type?: 'number' | 'category';
    allowDataOverflow?: boolean;
    allowDuplicatedCategory?: boolean;
    allowDecimals?: boolean;
    allowEvents?: boolean;
    allowMargin?: boolean;
    axisLine?: boolean;
    tick?: boolean;
    tickLine?: boolean;
    tickFormatter?: (value: any, index: number) => string;
    tickMargin?: number;
    tickMaxRotation?: number;
    tickMinRotation?: number;
    tickMirror?: boolean;
    tickSize?: number;
    ticks?: any[];
    ticksGenerator?: (domain: any) => any[];
    tickSpacing?: number;
    tickValueFormatter?: (value: any, index: number) => string;
    unit?: string | number;
    name?: string | number;
    domain?: any;
    scale?: string;
    width?: number;
    height?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    orientation?: 'left' | 'right';
    yAxisId?: string | number;
    reversed?: boolean;
    label?: string | number | React.ReactNode;
    scaleToFit?: boolean;
    tickCount?: number;
  }
  
  export const YAxis: ComponentType<YAxisProps>;
  
  export interface TooltipProps {
    active?: boolean;
    coordinate?: { x?: number; y?: number };
    cursor?: boolean | object;
    filterNull?: boolean;
    itemStyle?: object;
    labelFormatter?: (label: any, payload: any[]) => string;
    labelStyle?: object;
    separator?: string;
    offset?: number;
    position?: object;
    wrapperStyle?: object;
    content?: React.ReactNode;
    viewBox?: object;
    isAnimationActive?: boolean;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    animationBegin?: number;
    itemSorter?: (item: any) => number;
    filterNull?: boolean;
    payload?: any[];
    label?: any;
    labelStyle?: object;
    itemStyle?: object;
    contentStyle?: object;
  }
  
  export const Tooltip: ComponentType<TooltipProps>;
  
  export interface LineProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey?: string | number;
    stroke?: string;
    fill?: string;
    fillOpacity?: number;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeDasharray?: string;
    strokeDashoffset?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    strokeMiterlimit?: number;
    strokeWidth?: number;
    fillOpacity?: number;
    opacity?: number;
    vectorEffect?: 'none' | 'non-scaling-stroke';
    sortIndex?: number;
    points?: Array<{ x: number; y: number }>;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    animationSteps?: number;
    legendType?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    dot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    activeDot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    connectNulls?: boolean;
    yAxisId?: string | number;
    xAxisId?: string | number;
    id?: string;
    className?: string;
    name?: string | number;
    legendItem?: boolean;
    tooltip?: any;
    data?: any[];
    layout?: 'horizontal' | 'vertical';
  }
  
  export const Line: ComponentType<LineProps>;
  
  export interface BarProps {
    dataKey?: string | number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    stackId?: string;
    maxBarSize?: number;
    cornerRadius?: number | [number, number, number, number];
    minPointSize?: number;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    animationSteps?: number;
    legendType?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    dot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    yAxisId?: string | number;
    xAxisId?: string | number;
    id?: string;
    className?: string;
    name?: string | number;
    legendItem?: boolean;
    tooltip?: any;
    data?: any[];
    layout?: 'horizontal' | 'vertical';
    children?: React.ReactNode;
  }
  
  export const Bar: ComponentType<BarProps>;
  
  export interface PieProps {
    cx?: number | string;
    cy?: number | string;
    innerRadius?: number | string;
    outerRadius?: number | string;
    fill?: string;
    dataKey?: string;
    nameKey?: string;
    valueKey?: string;
    startAngle?: number;
    endAngle?: number;
    minAngle?: number;
    paddingAngle?: number;
    blendStroke?: boolean;
    stroke?: string;
    strokeWidth?: number;
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    strokeLinecap?: 'butt' | 'round' | 'square';
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    animationSteps?: number;
    legendType?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    tooltip?: any;
    data?: any[];
    id?: string;
    className?: string;
    name?: string | number;
    legendItem?: boolean;
    customLabel?: any;
    customTooltip?: any;
    label?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    labelLine?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    children?: React.ReactNode;
  }
  
  export const Pie: ComponentType<PieProps>;
  
  export interface AreaProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey?: string | number;
    stroke?: string;
    fill?: string;
    fillOpacity?: number;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeDasharray?: string;
    strokeDashoffset?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'round' | 'miter' | 'bevel';
    strokeMiterlimit?: number;
    strokeWidth?: number;
    fillOpacity?: number;
    opacity?: number;
    vectorEffect?: 'none' | 'non-scaling-stroke';
    sortIndex?: number;
    points?: Array<{ x: number; y: number }>;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: number;
    animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    animationSteps?: number;
    legendType?: 'line' | 'rect' | 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    dot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    activeDot?: boolean | React.ReactNode | ((props: any) => React.ReactNode);
    connectNulls?: boolean;
    yAxisId?: string | number;
    xAxisId?: string | number;
    id?: string;
    className?: string;
    name?: string | number;
    legendItem?: boolean;
    tooltip?: any;
    data?: any[];
    layout?: 'horizontal' | 'vertical';
    stackId?: string;
  }
  
  export const Area: ComponentType<AreaProps>;
  
  export interface CellProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillOpacity?: number;
    opacity?: number;
    className?: string;
    onClick?: (event: any, props: any) => void;
    onMouseEnter?: (event: any, props: any) => void;
    onMouseLeave?: (event: any, props: any) => void;
  }
  
  export const Cell: ComponentType<CellProps>;
}