import './hub.css'

// Landing page: the whole case study as one picture. A phone in the middle (the product),
// six cards around it (the work), joined by animated lines. Cards scroll to their story
// below, or open the prototype / dashboard.

type Card = {
  id: string
  side: 'left' | 'right'
  row: 0 | 1 | 2
  title: string
  stat: string
  line: string
  icon: JSX.Element
  open?: string // a route to open instead of scrolling
}

const I = {
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  compare: <><path d="M4 7h12l-3-3M20 17H8l3 3" /></>,
  doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7M14 3v5h5" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
}

const CARDS: Card[] = [
  { id: 'reviews', side: 'left', row: 0, title: 'Customer reviews', stat: '2,500', line: 'Play Store reviews, 685 angry', icon: I.chat },
  { id: 'cause', side: 'left', row: 1, title: 'Root cause', stat: '53.3%', line: 'of angry reviews: locked out of their money', icon: I.lock },
  { id: 'rivals', side: 'left', row: 2, title: 'Competitors', stat: 'No ETA', line: 'Monzo says 2 days, Wise shows a time. Revolut shows none', icon: I.compare },
  { id: 'prd', side: 'right', row: 0, title: 'PRD', stat: '4 musts', line: 'Stage, what we need, ETA, what still works', icon: I.doc },
  { id: 'proto', side: 'right', row: 1, title: 'Prototype', stat: 'Try it', line: 'Account Review Tracker, clickable', icon: I.phone, open: '#/tracker' },
  { id: 'fraud', side: 'right', row: 2, title: 'Fraud rules', stat: '0.6% → 99.8%', line: 'fraud money stopped, SQL on 6.3M transactions', icon: I.shield, open: '#/fraud' },
]

// Stage is 1000 x 620. Cards are 250 wide; phone sits in the middle (390–610, 70–550).
const ROW_Y = [125, 310, 495]
const PHONE_Y = [210, 310, 410]
function pathFor(c: Card) {
  const y = ROW_Y[c.row]
  const py = PHONE_Y[c.row]
  if (c.side === 'left') return c.row === 1 ? `M290 ${y} H392` : `M290 ${y} H340 V${py} H392`
  return c.row === 1 ? `M710 ${y} H608` : `M710 ${y} H660 V${py} H608`
}

const STORY = [
  {
    id: 'reviews', n: 1, title: 'Listen: 2,500 reviews',
    body: 'I pulled the 2,500 newest English Play Store reviews of Revolut (7 Oct to 23 Nov 2026) with Python in Colab, and tagged each with 9 complaint themes. 685 were angry (1 or 2 stars).',
  },
  {
    id: 'cause', n: 2, title: 'Find the real problem: locked out',
    body: 'Counting themes in SQL showed that 53.3% of angry reviews come from people who can’t reach their money: frozen accounts, stuck verification, or can’t log in. 27.4% of them also say support didn’t help. Frozen-account reviews average 1.32 stars, the angriest theme.',
  },
  {
    id: 'rivals', n: 3, title: 'Check the market',
    body: 'Monzo tells customers most reviews finish within 2 days. Wise shows an estimated time in the app. Revolut shows neither, so customers loop through chat.',
  },
  {
    id: 'prd', n: 4, title: 'Write the PRD',
    body: 'An in-app Account Review Tracker: the stage of the review, what Revolut needs (with upload), a time range, and what still works. Primary metric: repeat support contacts per restricted account, target −30%. Guardrails: fraud losses and review time must not get worse.',
  },
  {
    id: 'proto', n: 5, title: 'Build the prototype', link: '#/tracker', linkText: 'Open the prototype',
    body: 'A clickable React prototype of the tracker: home alert, 5-stage tracker, document upload, and an “I need money for essentials” request.',
  },
  {
    id: 'fraud', n: 6, title: 'Prevent it: block fewer good customers', link: '#/fraud', linkText: 'Open the fraud dashboard',
    body: 'Accounts get frozen because fraud rules flag them. I tested 9 rules in SQL on 6.3M simulated transactions (PaySim). The existing rule stopped 0.6% of fraud money; the recommended rule stops 99.8% and flags 4.6 genuine transactions per 10,000.',
  },
]

export default function Hub() {
  const go = (c: { id: string; open?: string }) => {
    if (c.open) {
      window.location.hash = c.open
      return
    }
    document.getElementById(`story-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="hub">
      <header className="hub-head">
        <p className="hub-eyebrow">Product case study · Laya H</p>
        <h1>“Locked out of my money”</h1>
        <p className="hub-intro">
          Why Revolut customers leave 1-star reviews, a product to fix it, and fraud rules that block fewer good customers in the first place.
        </p>
      </header>

      <div className="hub-stage" aria-label="Case study map">
        <svg className="hub-deco" viewBox="0 0 1000 620" aria-hidden="true">
          <g className="d1"><rect x="330" y="20" width="34" height="24" rx="4" /><path d="M330 28h34" /></g>
          <g className="d2"><path d="M650 560v-22M662 560v-32M674 560v-16M686 560v-40" /></g>
          <g className="d3"><circle cx="680" cy="40" r="12" /><path d="M680 34v12M674 40h12" /></g>
          <g className="d4"><path d="M318 560l12-12 10 8 16-18" /></g>
        </svg>
        <svg className="hub-lines" viewBox="0 0 1000 620" aria-hidden="true">
          {CARDS.map((c, i) => (
            <g key={c.id}>
              <path id={`p-${c.id}`} d={pathFor(c)} className="hub-path" style={{ animationDelay: `${0.4 + i * 0.12}s` }} />
              <circle r="4" className="hub-dot">
                <animateMotion dur="3.2s" begin={`${i * 0.5}s`} repeatCount="indefinite">
                  <mpath href={`#p-${c.id}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </svg>

        <button className="hub-phone" onClick={() => (window.location.hash = '#/tracker')} aria-label="Open the Account Review Tracker prototype">
          <div className="hp-notch" />
          <div className="hp-top">
            <span>Account review</span>
            <span className="hp-pill">In progress</span>
          </div>
          <div className="hp-eta">
            <small>Usually</small>
            <b>1 to 2 days</b>
          </div>
          <ol className="hp-steps">
            {['Review started', 'Info needed from you', 'Documents received', 'Under review', 'Decision'].map((s, i) => (
              <li key={s} className={i === 0 ? 'done' : i === 1 ? 'now' : ''}>
                <span />
                {s}
              </li>
            ))}
          </ol>
          <div className="hp-need">
            <b>What we need</b>
            <span>Proof of address</span>
            <span>Source of funds</span>
          </div>
          <div className="hp-works">You can still receive money</div>
          <div className="hp-btn">Upload 2 documents</div>
          <div className="hp-tap">Tap to try the prototype</div>
        </button>

        {CARDS.map((c, i) => (
          <button
            key={c.id}
            className={`hub-card ${c.side} r${c.row}${c.open ? ' opens' : ''}`}
            style={{ animationDelay: `${0.2 + i * 0.12}s` }}
            onClick={() => go(c)}
          >
            <span className="hc-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">{c.icon}</svg>
            </span>
            <span className="hc-body">
              <span className="hc-title">
                {c.title}
                {c.open && <span className="hc-arrow" aria-hidden="true">›</span>}
              </span>
              <span className="hc-stat">{c.stat}</span>
              <span className="hc-line">{c.line}</span>
            </span>
          </button>
        ))}
      </div>

      <section className="hub-story">
        <h2>How I did it</h2>
        <ol>
          {STORY.map((s) => (
            <li key={s.id} id={`story-${s.id}`}>
              <span className="hs-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.link && (
                  <a href={s.link} className="hs-link">
                    {s.linkText} →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="hub-foot">
          Tools: Python, pandas, SQL (DuckDB), React + TypeScript, GitHub Pages. Product concept, not affiliated with Revolut.{' '}
          <a href="https://github.com/LayaHilarius/revolut-po-case-study">Code and data on GitHub</a>
        </p>
      </section>
    </div>
  )
}
