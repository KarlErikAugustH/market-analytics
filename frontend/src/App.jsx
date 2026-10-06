import { useEffect, useState } from 'react'
import OverMaChart from './components/OverMaChart'
import './App.css'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function getData() {
      const url = "http://127.0.0.1:8000/ma?index_name=OMXS30&ma_window=50"
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error(error.message)
      }
    }
    getData()
  }, [])

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
          <span className="market-tag">OMXS30 / MA50</span>
        </div>
        <section className="chart-card" aria-labelledby="breadth-title">
          <div className="card-heading">
            <div>
              <div className="title-row"><h2 id="breadth-title">OMXS30 Market Breadth</h2><span className="indicator-badge">MA50</span></div>
              <p className="subtitle">Percentage of index constituents trading above their moving average</p>
            </div>
            <div className="latest-value"><span>Latest breadth</span><strong>{percentage}</strong><span>{latest?.date ? `As of ${latest.date}` : 'No observations available'}</span></div>
          </div>
          <div className="chart-toolbar">
            <span className="series-label"><span className="series-swatch" />Above 50-day moving average</span>
            <div className="period-controls" role="group" aria-label="Period preview; full history is displayed">
              {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
                <button key={period} type="button" className={period === 'ALL' ? 'active' : ''} aria-pressed={period === 'ALL'} disabled={period !== 'ALL'} title={period === 'ALL' ? 'Full history displayed' : 'Period filtering coming soon'}>{period}</button>
              ))}
            </div>
          </div>
          <div className="chart-area"><OverMaChart data={data} /></div>
          <div className="chart-footer"><span><span className="reference-swatch" />50% reference level</span><span>Full history · Period controls are preview only</span></div>
        </section>
        <p className="dashboard-note">Breadth measures participation across the index. Values range from 0% to 100%.</p>
      </main>
    </div>
  )
}

export default App

