import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartMargin, chartSyncId, dateAxisProps, tooltipProps, yAxisWidth } from './chartConfig'

export default function IndexChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart data={data} margin={chartMargin} syncId={chartSyncId} syncMethod="value" accessibilityLayer>
        <CartesianGrid vertical={false} stroke="#263241" strokeDasharray="3 5" />
        <XAxis {...dateAxisProps} tick={false} />
        <YAxis domain={['auto', 'auto']} tickFormatter={(value) => Number(value).toLocaleString('en-US')} tick={{ fill: '#9aaabd', fontSize: 11 }} tickLine={false} axisLine={false} width={yAxisWidth} />
        <Tooltip {...tooltipProps} formatter={(value) => [Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 'Close']} />
        <Line dataKey="close" name="Close" type="linear" stroke="#57b9ec" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#57b9ec', stroke: '#111923', strokeWidth: 2 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
