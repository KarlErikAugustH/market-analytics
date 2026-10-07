import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { chartMargin, chartSyncId, dateAxisProps, tooltipProps, yAxisWidth } from './chartConfig';

export default function OverMaChart({ data, maWindow = 50 }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart data={data} margin={chartMargin} syncId={chartSyncId} syncMethod="value" accessibilityLayer>
        <CartesianGrid vertical={false} stroke="#263241" strokeDasharray="3 5" />
        <XAxis {...dateAxisProps} />
        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} allowDataOverflow tickFormatter={(value) => `${value}%`} tick={{ fill: '#9aaabd', fontSize: 11 }} tickLine={false} axisLine={false} width={yAxisWidth} />
        <Tooltip {...tooltipProps} formatter={(value) => [`${Number(value).toFixed(1)}%`, `Above MA${maWindow}`]} />
        <ReferenceLine y={50} stroke="#8193a8" strokeDasharray="5 5" />
        <Line connectNulls dataKey="percentage" name={`Above MA${maWindow}`} type="linear" stroke="#57b9ec" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#57b9ec', stroke: '#111923', strokeWidth: 2 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

