import { useState } from 'react'

type Screen = 'home' | 'tracker' | 'needs' | 'essentials' | 'essentialsDone'

type Doc = { id: string; title: string; hint: string; done: boolean }

const STAGES = [
  { title: 'Review started', note: '21 Nov, 10:42' },
  { title: 'Information needed from you', note: 'Due by 28 Nov' },
  { title: 'Documents received', note: 'Usually reviewed within 24 hours' },
  { title: 'Under review', note: 'Usually 1–2 days' },
  { title: 'Decision', note: "We'll notify you" },
]

function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-icons">●●● ▲ ▮</span>
    </div>
  )
}

function TopBar({ title, onBack }: { title?: string; onBack?: () => void }) {
  return (
    <div className="topbar">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
      ) : (
        <div className="avatar">LH</div>
      )}
      <span className="topbar-title">{title}</span>
      <span className="icon-btn ghost" />
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="stepper">
      {STAGES.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo'
        return (
          <li key={s.title} className={`step ${state}`}>
            <span className="dot">{state === 'done' ? '✓' : i + 1}</span>
            <div>
              <div className="step-title">{s.title}</div>
              <div className="step-note">{s.note}</div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [docs, setDocs] = useState<Doc[]>([
    { id: 'payslip', title: 'Proof of income', hint: 'Last 3 months of payslips or a salary statement', done: false },
    { id: 'statement', title: 'Bank statement', hint: 'From the account that sent €2,400 on 19 Nov', done: false },
  ])
  const [reason, setReason] = useState('')
  const allDone = docs.every((d) => d.done)
  const stage = allDone ? 2 : 1

  const upload = (id: string) => setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, done: true } : d)))

  return (
    <div className="stage-bg">
      <aside className="caption">
        <p className="eyebrow">Product concept · not affiliated with Revolut</p>
        <h1>Account Review Tracker</h1>
        <p>When an account is under review, customers don't know why, what to do, or how long it will take. 53.3% of 1–2 star Play Store reviews are customers locked out of their money.</p>
        <p>This prototype shows the stage, what's needed, an expected time, and what still works, so customers don't have to chase support.</p>
        <p className="muted">Try: find what you need to upload, then find when you'll get full access back.</p>
        <a href="https://github.com/LayaHilarius/revolut-po-case-study">Case study and PRD →</a>
      </aside>

      <div className="phone">
        <StatusBar />

        {screen === 'home' && (
          <div className="screen">
            <TopBar />
            <div className="balance">
              <div className="balance-label">Personal · EUR</div>
              <div className="balance-amount">€3,218<span>.40</span></div>
              <div className="chips">
                <span className="chip disabled">+ Add money</span>
                <span className="chip disabled">→ Move</span>
                <span className="chip">⋯ More</span>
              </div>
            </div>

            <button className="review-card" onClick={() => setScreen('tracker')}>
              <div className="rc-top">
                <span className="rc-icon">🛡️</span>
                <div>
                  <div className="rc-title">Your account is under review</div>
                  <div className="rc-sub">
                    {allDone ? 'Documents received · usually reviewed within 24 hours' : 'We need 2 documents from you · due 28 Nov'}
                  </div>
                </div>
              </div>
              <div className="rc-progress"><span style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></div>
              <div className="rc-foot">Step {stage + 1} of {STAGES.length} · View progress →</div>
            </button>

            <div className="card">
              <div className="card-title">Transactions</div>
              {[
                ['🛒', 'Lidl', 'Today, 18:20', '-€23.10'],
                ['☕', 'Starbucks', 'Yesterday', '-€4.50'],
                ['🏦', 'Salary', '19 Nov', '+€2,400.00'],
              ].map(([ic, n, d, a]) => (
                <div className="tx" key={n}>
                  <span className="tx-ic">{ic}</span>
                  <div className="tx-mid"><div>{n}</div><div className="muted small">{d}</div></div>
                  <span className={a.startsWith('+') ? 'pos' : ''}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'tracker' && (
          <div className="screen">
            <TopBar title="Account review" onBack={() => setScreen('home')} />
            <div className="hero">
              <div className="hero-eta">{allDone ? 'Usually within 24 hours' : 'Waiting for your documents'}</div>
              <p className="hero-sub">
                {allDone
                  ? "Thanks, we've got everything we need. Most reviews finish within 1–2 days. You don't need to contact support for updates — we'll notify you."
                  : 'This is a routine check required by financial regulations. It does not mean you did anything wrong.'}
              </p>
            </div>

            {!allDone && (
              <button className="primary" onClick={() => setScreen('needs')}>Upload 2 documents</button>
            )}

            <div className="card">
              <div className="card-title">Progress</div>
              <Stepper current={stage} />
            </div>

            <div className="card">
              <div className="card-title">During the review</div>
              <div className="works"><span className="ok">✓</span> Receive money into your account</div>
              <div className="works"><span className="ok">✓</span> See your balance and statements</div>
              <div className="works"><span className="no">⏸</span> Card payments and transfers are paused</div>
            </div>

            <button className="secondary" onClick={() => setScreen('essentials')}>I need money for essentials</button>
            <p className="footnote">For rent, food, medicine or bills. A specialist reviews these requests first.</p>
          </div>
        )}

        {screen === 'needs' && (
          <div className="screen">
            <TopBar title="What we need" onBack={() => setScreen('tracker')} />
            <p className="lead">Please upload these by <b>28 Nov</b>. Clear photos or PDFs work best.</p>
            <div className="card">
              {docs.map((d) => (
                <div className="doc" key={d.id}>
                  <div className="doc-mid">
                    <div className="doc-title">{d.title}</div>
                    <div className="muted small">{d.hint}</div>
                  </div>
                  {d.done ? (
                    <span className="badge">✓ Uploaded</span>
                  ) : (
                    <button className="pill" onClick={() => upload(d.id)}>Upload</button>
                  )}
                </div>
              ))}
            </div>
            <button className="primary" disabled={!allDone} onClick={() => setScreen('tracker')}>
              {allDone ? 'Submit for review' : `${docs.filter((d) => d.done).length} of ${docs.length} uploaded`}
            </button>
            <p className="footnote">Why do we ask? Regulations require us to confirm where larger payments come from.</p>
          </div>
        )}

        {screen === 'essentials' && (
          <div className="screen">
            <TopBar title="Essentials request" onBack={() => setScreen('tracker')} />
            <p className="lead">Tell us what you need money for. A specialist will review this before other requests.</p>
            <div className="card">
              {['Rent or mortgage', 'Food and groceries', 'Medicine', 'Bills and utilities'].map((r) => (
                <label className={`radio ${reason === r ? 'sel' : ''}`} key={r}>
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />
                  {r}
                </label>
              ))}
            </div>
            <button className="primary" disabled={!reason} onClick={() => setScreen('essentialsDone')}>Send request</button>
          </div>
        )}

        {screen === 'essentialsDone' && (
          <div className="screen center">
            <div className="big-ok">✓</div>
            <h2>Request sent</h2>
            <p className="lead">We'll reply within 4 hours. You'll get a notification — no need to start a chat.</p>
            <button className="primary" onClick={() => setScreen('tracker')}>Back to review</button>
          </div>
        )}
      </div>
    </div>
  )
}
