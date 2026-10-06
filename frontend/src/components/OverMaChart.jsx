import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function OverMaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <LineChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }} accessibilityLayer>
        <CartesianGrid vertical={false} stroke="#263241" strokeDasharray="3 5" />
        <XAxis dataKey="date" tick={{ fill: '#9aaabd', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={48} tickMargin={12} interval="preserveStartEnd" />
        <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} allowDataOverflow tickFormatter={(value) => `${value}%`} tick={{ fill: '#9aaabd', fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Above MA50']} contentStyle={{ background: '#172330', border: '1px solid #35495f', borderRadius: 6, fontSize: 12, color: '#e5edf5' }} labelStyle={{ color: '#9aaabd', marginBottom: 6 }} itemStyle={{ color: '#57b9ec' }} cursor={{ stroke: '#52647a', strokeDasharray: '3 3' }} />
        <ReferenceLine y={50} stroke="#8193a8" strokeDasharray="5 5" />
        <Line dataKey="percentage" name="Above MA50" type="linear" stroke="#57b9ec" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#57b9ec', stroke: '#111923', strokeWidth: 2 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

