import { useEffect, useMemo, useState } from 'react'
import OverMaChart from './components/OverMaChart'
import IndexChart from './components/IndexChart'
import { comparisonData } from './chartData'
import './App.css'

function App() {
  const [breadthData, setBreadthData] = useState({ 50: [], 200: [] })
  const [breadthStatus, setBreadthStatus] = useState({ 50: 'loading', 200: 'loading' })
  const [selectedMA, setSelectedMA] = useState(50)
  const data = breadthData[selectedMA]
  const [indexData, setIndexData] = useState([])
  const [indexStatus, setIndexStatus] = useState('loading')
  const [period, setPeriod] = useState('ALL')

  useEffect(() => {
    const controller = new AbortController()
    async function getBreadthData(maWindow, endpoint) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/${endpoint}?index_name=OMXS30&ma_window=${maWindow}`, { signal: controller.signal })
        if (!response.ok) throw new Error(`Response status: ${response.status}`)
        const result = await response.json()
        if (!Array.isArray(result)) throw new Error('Invalid breadth data response')
        setBreadthData((previous) => ({ ...previous, [maWindow]: result }))
        setBreadthStatus((previous) => ({ ...previous, [maWindow]: 'ready' }))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error.message)
          setBreadthStatus((previous) => ({ ...previous, [maWindow]: 'error' }))
        }
      }
    }
    getBreadthData(50, 'ma')
    getBreadthData(200, 'ma200')
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    async function getIndexData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/index_data?index_name=%5EOMX', { signal: controller.signal })
        if (!response.ok) throw new Error(`Response status: ${response.status}`)
        const result = await response.json()
        if (!Array.isArray(result)) throw new Error('Invalid index data response')
        setIndexData(result)
        setIndexStatus('ready')
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error.message)
          setIndexStatus('error')
        }
      }
    }
    getIndexData()
    return () => controller.abort()
  }, [])

  // Keep the index date scale stable when switching between breadth datasets.
  const timeline = useMemo(
    () => comparisonData([...breadthData[50], ...breadthData[200]], indexData, period),
    [breadthData, indexData, period],
  )
  const chartData = useMemo(() => {
    const selectedObservations = new Map(data.map((row) => [row.date, row]))
    return timeline.map((row) => ({
      ...row,
      percentage: selectedObservations.get(row.date)?.percentage ?? null,
      count: selectedObservations.get(row.date)?.count ?? null,
      total: selectedObservations.get(row.date)?.total ?? null,
    }))
  }, [data, timeline])
  const latestIndex = indexData.at(-1)
  const close = typeof latestIndex?.close === 'number'
    ? latestIndex.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '\u2014'

  const latest = data.at(-1)
  const percentage = typeof latest?.percentage === 'number' ? `${latest.percentage.toFixed(1)}%` : '—'

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#dashboard">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M3 19V5M3 19h18M7 15l4-5 4 2 6-7" stroke="currentColor" strokeWidth="1.8" /></svg>
          Market Analytics
        </a>
        <nav aria-label="Main navigation"><a href="#dashboard" aria-current="page">Market breadth</a></nav>
        <span className="header-context">Index research</span>
      </header>
      <main id="dashboard" className="dashboard">
        <div className="page-heading">
          <div><p className="eyebrow">MARKET OVERVIEW</p><h1>Market breadth</h1></div>
          <span className="market-tag">OMXS30 / MA{selectedMA}</span>
        </div>
        <div className="comparison-toolbar">
          <span className="series-label">Compare index price and market participation</span>
          <div className="period-controls" role="group" aria-label="Period for both charts">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((option) => (
              <button key={option} type="button" className={period === option ? 'active' : ''} aria-pressed={period === option} onClick={() => setPeriod(option)}>{option}</button>
            ))}
          </div>
        </div>
        <div className="chart-card analysis-panel">
          <section className="chart-panel index-panel" aria-labelledby="index-title">
            <div className="card-heading">
              <div>
                <div className="title-row"><h2 id="index-title">OMXS30 Index</h2></div>
                <p className="subtitle">Daily closing price &middot; Shared date range with market breadth</p>
              </div>
              <div className="latest-value"><span>Latest close</span><strong>{close}</strong><span>{latestIndex?.date ? `As of ${latestIndex.date}` : 'No observations available'}</span></div>
            </div>
            <div className="chart-toolbar"><span className="series-label"><span className="series-swatch" />OMXS30 closing price</span></div>
            {indexStatus === 'loading' && <p className="chart-status" role="status">Loading index data...</p>}
            {indexStatus === 'error' && <p className="chart-status" role="status">Unable to load OMXS30 index data.</p>}
            {indexStatus === 'ready' && !indexData.length && <p className="chart-status" role="status">No index observations available.</p>}
            <div className="chart-area"><IndexChart data={chartData} /></div>
          </section>
          <section className="chart-panel breadth-panel" aria-labelledby="breadth-title">
            <div className="card-heading">
              <div>
                <div className="title-row"><h2 id="breadth-title">OMXS30 Market Breadth</h2><span className="indicator-badge">MA{selectedMA}</span></div>
                <p className="subtitle">Percentage of index constituents trading above their moving average</p>
                <div className="period-controls ma-controls" role="group" aria-label="Breadth moving average">
                  {[50, 200].map((maWindow) => (
                    <button key={maWindow} type="button" className={selectedMA === maWindow ? 'active' : ''} aria-pressed={selectedMA === maWindow} onClick={() => setSelectedMA(maWindow)}>MA{maWindow}</button>
                  ))}
                </div>
              </div>
              <div className="latest-value"><span>Latest breadth</span><strong>{percentage}</strong><span>{latest?.date ? `As of ${latest.date}` : 'No observations available'}</span></div>
            </div>
            <div className="chart-toolbar">
              <span className="series-label"><span className="series-swatch" />Above {selectedMA}-day moving average</span>
            </div>
            {breadthStatus[selectedMA] === 'loading' && <p className="chart-status" role="status">Loading MA{selectedMA} breadth data...</p>}
            {breadthStatus[selectedMA] === 'error' && <p className="chart-status" role="status">Unable to load MA{selectedMA} breadth data.</p>}
            {breadthStatus[selectedMA] === 'ready' && !data.length && <p className="chart-status" role="status">No MA{selectedMA} breadth observations available.</p>}
            <div className="chart-area"><OverMaChart data={chartData} maWindow={selectedMA} /></div>
            <div className="chart-footer"><span><span className="reference-swatch" />50% reference level</span><span>{period === 'ALL' ? 'Full history' : `${period} period`} &middot; Shared date range</span></div>
          </section>
        </div>
        <p className="dashboard-note">Breadth measures participation across the index. Values range from 0% to 100%.</p>
      </main>
    </div>
  )
}

export default App

