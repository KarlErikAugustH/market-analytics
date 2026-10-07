export function comparisonData(breadth, index, period) {
  const rows = new Map()
  for (const observation of breadth) {
    rows.set(observation.date, { ...observation, close: null })
  }
  for (const observation of index) {
    rows.set(observation.date, {
      date: observation.date, percentage: null,
      ...rows.get(observation.date), close: observation.close,
    })
  }
  const data = [...rows.values()]
    .map((row) => ({ ...row, timestamp: Date.parse(`${row.date}T00:00:00Z`) }))
    .filter((row) => Number.isFinite(row.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp)
  if (period === 'ALL' || !data.length) return data

  // Anchor periods to the latest observation and clamp calendar month ends.
  const end = new Date(data.at(-1).timestamp)
  const months = { '1M': 1, '3M': 3, '6M': 6, '1Y': 12 }[period]
  const start = new Date(end)
  start.setUTCDate(1)
  start.setUTCMonth(start.getUTCMonth() - months)
  const lastDay = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate()
  start.setUTCDate(Math.min(end.getUTCDate(), lastDay))
  return data.filter((row) => row.timestamp >= start.getTime())
}
