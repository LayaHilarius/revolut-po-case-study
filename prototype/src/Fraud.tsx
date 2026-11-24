import { useState } from 'react'
import './fraud.css'
import { byAmount, byHour, byType, emptied, missedByF, rules, totals, type Rule } from './fraudData'

const fmt = (n: number) => n.toLocaleString('en-US')
const millions = (v: number) => (v / 1e9 >= 1 ? `${(v / 1e9).toFixed(1)}B` : `${(v / 1e6).toFixed(0)}M`)

type Tip = { x: number; y: number; lines: string[] } | null

function Tooltip({ tip }: { tip: Tip }) {
  if (!tip) return null
  return (
    <div className="viz-tip" style={{ left: tip.x, top: tip.y }}>
      {tip.lines.map((l, i) => (
        <div key={i} className={i === 0 ? 'tip-head' : ''}>{l}</div>
      ))}
    </div>
  )
}

function useTip() {
  const [tip, setTip] = useState<Tip>(null)
  const show = (e: React.MouseEvent, lines: string[]) => {
    const box = (e.currentTarget as Element).closest('.chart')!.getBoundingClientRect()
    setTip({ x: e.clientX - box.left + 12, y: e.clientY - box.top + 12, lines })
  }
  return { tip, show, hide: () => setTip(null) }
}

/* 1. Fraud value by transaction type: horizontal bars, one series */
function TypeChart() {
  const { tip, show, hide } = useTip()
  const max = Math.max(...byType.map((d) => d.fraudValue))
  return (
    <div className="chart">
      <div className="hbars">
        {byType.map((d) => (
          <div className="hrow" key={d.type}>
            <span className="hlabel">{d.type}</span>
            <div
              className="htrack"
              onMouseMove={(e) => show(e, [d.type, `${fmt(d.n)} transactions`, `${fmt(d.fraud)} frauds (${((100 * d.fraud) / d.n).toFixed(2)}%)`, `Fraud value: ${millions(d.fraudValue)}`])}
              onMouseLeave={hide}
            >
              {d.fraudValue > 0 ? (
                <div className="hbar s-fraud" style={{ width: `${(100 * d.fraudValue) / max}%` }} />
              ) : (
                <span className="zero">no fraud</span>
              )}
            </div>
            <span className="hval">{d.fraudValue > 0 ? millions(d.fraudValue) : '0'}</span>
          </div>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  )
}

/* 2. Emptied vs exact full balance: grouped bars, two series (genuine / fraud) */
function SignalChart() {
  const { tip, show, hide } = useTip()
  const groups = [
    { label: 'Leaves a zero balance', genuine: emptied.genuine.emptiedPct, fraud: emptied.fraud.emptiedPct },
    { label: 'Moves exactly the full balance', genuine: 0, fraud: rules.find((r) => r.id === 'F')!.caught },
  ]
  return (
    <div className="chart">
      <div className="legend">
        <span><i className="sw s-genuine" />Genuine</span>
        <span><i className="sw s-fraud" />Fraud</span>
      </div>
      <div className="vgroups">
        {groups.map((g) => (
          <div className="vgroup" key={g.label}>
            <div className="vbars">
              {(['genuine', 'fraud'] as const).map((k) => (
                <div
                  className="vcol"
                  key={k}
                  onMouseMove={(e) => show(e, [g.label, `${k === 'fraud' ? 'Fraud' : 'Genuine'}: ${g[k].toFixed(1)}% of transfers and cash-outs`])}
                  onMouseLeave={hide}
                >
                  <span className="vval">{g[k].toFixed(1)}%</span>
                  <div className={`vbar s-${k}`} style={{ height: `${Math.max(g[k], 0.6)}%` }} />
                </div>
              ))}
            </div>
            <div className="vlabel">{g.label}</div>
          </div>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  )
}

/* 3/4. Fraud rate by hour / amount band: single-series columns */
function RateColumns({ data, label }: { data: { key: string; n: number; fraud: number }[]; label: string }) {
  const { tip, show, hide } = useTip()
  if (!data.length) return <div className="pending">Data coming from the Colab export.</div>
  const rates = data.map((d) => (100 * d.fraud) / d.n)
  const max = Math.max(...rates)
  return (
    <div className="chart">
      <div className="cols">
        {data.map((d, i) => (
          <div
            className="col"
            key={d.key}
            onMouseMove={(e) => show(e, [`${label} ${d.key}`, `${fmt(d.fraud)} frauds of ${fmt(d.n)}`, `Fraud rate: ${rates[i].toFixed(2)}%`])}
            onMouseLeave={hide}
          >
            <div className="colbar s-fraud" style={{ height: `${(100 * rates[i]) / max}%` }} />
            <span className="collabel">{d.key}</span>
          </div>
        ))}
      </div>
      <Tooltip tip={tip} />
    </div>
  )
}

/* 5. The trade-off: money saved vs good customers blocked (symlog x) */
function TradeoffChart() {
  const { tip, show, hide } = useTip()
  const W = 640, H = 340, L = 48, R = 24, T = 30, B = 44
  const xs = (v: number) => {
    const t = Math.log10(1 + v) / Math.log10(1 + 2000)
    return L + t * (W - L - R)
  }
  const ys = (v: number) => T + (1 - v / 100) * (H - T - B)
  const ticks = [0, 1, 10, 100, 1000]
  const best = new Set(['F', 'I'])
  return (
    <div className="chart">
      <div className="scroll-x"><svg viewBox={`0 0 ${W} ${H}`} className="svg" role="img" aria-label="Fraud money saved versus good customers blocked for 9 rules">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={ys(v)} y2={ys(v)} className="grid" />
            <text x={L - 8} y={ys(v) + 4} className="tick" textAnchor="end">{v}%</text>
          </g>
        ))}
        {ticks.map((v) => (
          <text key={v} x={xs(v)} y={H - B + 18} className="tick" textAnchor="middle">{fmt(v)}</text>
        ))}
        <text x={(L + W - R) / 2} y={H - 6} className="axis-title" textAnchor="middle">Good customers blocked per 10,000 (log scale)</text>
        {rules.map((r: Rule) => (
          <g
            key={r.id}
            onMouseMove={(e) => show(e, [`Rule ${r.id}: ${r.name}`, r.logic, `Fraud money saved: ${r.moneySaved}%`, `Good customers blocked: ${fmt(r.blocked)} (${r.per10k} per 10k)`])}
            onMouseLeave={hide}
          >
            <circle cx={xs(r.per10k)} cy={ys(r.moneySaved)} r={16} className="hit" />
            <circle cx={xs(r.per10k)} cy={ys(r.moneySaved)} r={best.has(r.id) ? 7 : 5} className={best.has(r.id) ? 'fx-dot best' : 'fx-dot'} />
            <text x={xs(r.per10k) + 10} y={ys(r.moneySaved) + (r.id === 'D' ? 18 : -8)} className={best.has(r.id) ? 'dlabel strong' : 'dlabel'}>{r.id}</text>
          </g>
        ))}
        <text x={xs(0) + 14} y={ys(66)} className="note">↖ best corner: most money saved,</text>
        <text x={xs(0) + 14} y={ys(66) + 15} className="note">fewest good customers blocked</text>
      </svg></div>
      <Tooltip tip={tip} />
    </div>
  )
}

export default function Fraud() {
  const [showTable, setShowTable] = useState(false)
  const fraudRate = (100 * totals.frauds) / totals.transactions
  return (
    <div className="viz-root">
      <div className="page">
        <nav className="crumbs">
          <a href="#/">← Account Review Tracker prototype</a>
          <a href="https://github.com/LayaHilarius/revolut-po-case-study/tree/main/fraud-rules">SQL and write-up ↗</a>
        </nav>
        <header>
          <p className="eyebrow">Case study · Laya H</p>
          <h1>Fraud rules vs. good customers</h1>
          <p className="intro">
            Every payment app blocks suspicious transactions. Block too little and money is stolen; block too much and genuine
            customers are locked out of their own money, which is the top reason for 1–2 star Revolut reviews in my{' '}
            <a href="#/">first project</a>. I used SQL on 6.3M simulated mobile-money transactions to find a rule that does both jobs.
          </p>
        </header>

        <section className="kpis">
          <div className="kpi"><div className="kpi-v">{(totals.transactions / 1e6).toFixed(2)}M</div><div className="kpi-l">transactions over 30 days</div></div>
          <div className="kpi"><div className="kpi-v">{fmt(totals.frauds)}</div><div className="kpi-l">frauds ({fraudRate.toFixed(2)}% of all)</div></div>
          <div className="kpi"><div className="kpi-v">{millions(totals.fraudValue)}</div><div className="kpi-l">stolen in total</div></div>
          <div className="kpi accent"><div className="kpi-v">0.6% → 99.8%</div><div className="kpi-l">fraud money stopped: current rule vs. recommended</div></div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">1</span>
            <h2>Fraud lives in only two kinds of transaction</h2>
            <p>All 8,213 frauds are transfers or cash-outs. A fraudster takes over an account, transfers the money out, then cashes it out. Everyday payments, top-ups and debits never need a fraud check, which spares 3.6M transactions.</p>
          </div>
          <div className="panel"><div className="panel-title">Money stolen by transaction type</div><TypeChart /></div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">2</span>
            <h2>"Emptied the account" is a trap. "Moved exactly the full balance" isn't.</h2>
            <p>97.6% of frauds leave a zero balance, but so do 42.7% of genuine transfers and cash-outs (1.18M of them). People do move all their money. What genuine customers almost never do is move <b>exactly</b> the whole balance to the last unit. Fraudsters do it every time.</p>
          </div>
          <div className="panel"><div className="panel-title">Share of transfers and cash-outs showing each signal</div><SignalChart /></div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">3</span>
            <h2>When and how big</h2>
            <p>Fraud rate by hour of day and by amount, for transfers and cash-outs. These shape where a step-up check is worth the friction.</p>
          </div>
          <div className="panel two">
            <div><div className="panel-title">Fraud rate by hour of day</div><RateColumns data={byHour.map((d) => ({ key: String(d.hour), n: d.n, fraud: d.fraud }))} label="Hour" /></div>
            <div><div className="panel-title">Fraud rate by amount</div><RateColumns data={byAmount.map((d) => ({ key: d.band.replace(/^\d\. /, ''), n: d.n, fraud: d.fraud }))} label="Amount" /></div>
          </div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">4</span>
            <h2>Nine rules, one trade-off</h2>
            <p>Each dot is a rule. Up means more fraud money stopped; right means more genuine customers blocked. The current rule (A) blocks nobody, but only because it almost never fires. Broad rules (B, E) stop fraud by locking out hundreds of thousands of people. F and I sit in the top-left corner.</p>
            <p className="small">F misses {missedByF.missed} frauds; {missedByF.at10M} of them are exactly 10M, the per-transaction cap. Fraudsters drain rich accounts in 10M chunks, so rule I adds that signal.</p>
          </div>
          <div className="panel">
            <div className="panel-title">Fraud money saved vs. good customers blocked</div>
            <TradeoffChart />
            <button className="link" onClick={() => setShowTable((s) => !s)}>{showTable ? 'Hide' : 'Show'} the table</button>
            {showTable && (
              <table className="tbl">
                <thead><tr><th>Rule</th><th>Logic</th><th>Fraud caught</th><th>Money saved</th><th>Good blocked</th><th>Per 10k</th></tr></thead>
                <tbody>
                  {rules.map((r) => (
                    <tr key={r.id} className={r.id === 'F' || r.id === 'I' ? 'hl' : ''}>
                      <td>{r.id}. {r.name}</td><td>{r.logic}</td><td>{r.caught}%</td><td>{r.moneySaved}%</td><td>{fmt(r.blocked)}</td><td>{r.per10k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">5</span>
            <h2>Recommendation</h2>
          </div>
          <div className="panel reco">
            <div className="reco-row"><span className="tag block">Block</span><p><b>Rule F</b>: a transfer or cash-out that moves exactly the full balance. Stops 87.7% of fraud money and, in this data, blocks no genuine customers.</p></div>
            <div className="reco-row"><span className="tag stepup">Step up</span><p><b>The 10M-chunk signal</b> from rule I: ask for a fingerprint or in-app confirmation instead of freezing the account. Total fraud money stopped rises to 99.8%, and the 2,920 genuine customers it catches (4.6 per 10,000) get a 10-second check, not a lock-out.</p></div>
            <div className="reco-row"><span className="tag track">Explain</span><p>Anyone who is blocked sees the <a href="#/">Account Review Tracker</a>: what's happening, what we need, and how long it takes.</p></div>
          </div>
        </section>

        <section className="fx-step">
          <div className="fx-step-text">
            <span className="num">6</span>
            <h2>What this data can't tell us</h2>
          </div>
          <div className="panel limits">
            <p>PaySim is <b>simulated</b>. Its fraud generator always drains the exact balance, which makes rule F look perfect. Real fraudsters vary, so real false blocks will be higher.</p>
            <p>Before launch I'd run the rule in <b>shadow mode</b> (flag, don't block) for 2–4 weeks on live traffic, with guardrails: complaints about blocks, support contacts per blocked account, and time to unblock must not rise.</p>
          </div>
        </section>

        <footer className="foot">Data: PaySim (Kaggle, ealaxi/paysim1). Analysis in SQL (DuckDB). Built by Laya H as a portfolio case study; not affiliated with Revolut.</footer>
      </div>
    </div>
  )
}
