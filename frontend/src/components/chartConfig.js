// Shared geometry keeps every date at the same horizontal position.
export const chartMargin = { top: 12, right: 16, bottom: 8, left: 0 }
export const yAxisWidth = 64
export const chartSyncId = 'omxs30-comparison'
export const dateAxisProps = {
  dataKey: 'timestamp', type: 'number', scale: 'time',
  domain: ['dataMin', 'dataMax'],
  tickFormatter: (value) => new Date(value).toISOString().slice(0, 10),
  tick: { fill: '#9aaabd', fontSize: 11 },
  tickLine: false, axisLine: false, minTickGap: 48, tickMargin: 12,
  interval: 'preserveStartEnd', height: 36,
}
export const tooltipProps = {
  labelFormatter: (value) => new Date(value).toISOString().slice(0, 10),
  contentStyle: { background: '#172330', border: '1px solid #35495f', borderRadius: 6, fontSize: 12, color: '#e5edf5' },
  labelStyle: { color: '#9aaabd', marginBottom: 6 },
  itemStyle: { color: '#57b9ec' },
  cursor: { stroke: '#52647a', strokeDasharray: '3 3' },
}
