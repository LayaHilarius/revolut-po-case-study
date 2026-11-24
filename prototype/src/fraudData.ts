// Numbers come from SQL run on PaySim (6,362,620 simulated mobile-money transactions, 30 days).
// See ../../fraud-rules/queries.sql. Sections marked `pending` are filled from dashboard_data.json.

export const totals = {
  transactions: 6362620,
  frauds: 8213,
  fraudValue: 12056.4e6,
}

export const byType = [
  { type: 'CASH_OUT', n: 2237500, fraud: 4116, fraudValue: 5989.2e6 },
  { type: 'TRANSFER', n: 532909, fraud: 4097, fraudValue: 6067.2e6 },
  { type: 'PAYMENT', n: 2151495, fraud: 0, fraudValue: 0 },
  { type: 'CASH_IN', n: 1399284, fraud: 0, fraudValue: 0 },
  { type: 'DEBIT', n: 41432, fraud: 0, fraudValue: 0 },
]

// Transfers + cash-outs only
export const emptied = {
  genuine: { n: 2762196, emptiedPct: 42.7 },
  fraud: { n: 8213, emptiedPct: 97.6 },
}

export type Rule = {
  id: string
  name: string
  logic: string
  caught: number
  moneySaved: number
  blocked: number
  per10k: number
}

export const rules: Rule[] = [
  { id: 'A', name: 'Current rule', logic: 'Transfer over 200k', caught: 0.2, moneySaved: 0.6, blocked: 0, per10k: 0 },
  { id: 'B', name: 'Account emptied', logic: 'Transfer or cash-out that leaves a zero balance', caught: 97.6, moneySaved: 87.5, blocked: 1180062, per10k: 1857.1 },
  { id: 'C', name: 'Transfer empties account', logic: 'Transfer that leaves a zero balance', caught: 47.9, moneySaved: 37.9, blocked: 224728, per10k: 353.7 },
  { id: 'D', name: 'C + over 100k', logic: 'Rule C and amount over 100k', caught: 37.6, moneySaved: 37.6, blocked: 209558, per10k: 329.8 },
  { id: 'E', name: 'Emptied + over 200k', logic: 'Rule B and amount over 200k', caught: 64.5, moneySaved: 85.6, blocked: 601066, per10k: 945.9 },
  { id: 'F', name: 'Exact full balance', logic: 'Moves exactly the whole balance', caught: 97.6, moneySaved: 87.7, blocked: 0, per10k: 0 },
  { id: 'G', name: 'F, transfers only', logic: 'Rule F on transfers only', caught: 48.0, moneySaved: 38.1, blocked: 0, per10k: 0 },
  { id: 'H', name: 'F, at night', logic: 'Rule F between midnight and 6 AM', caught: 23.9, moneySaved: 21.9, blocked: 0, per10k: 0 },
  { id: 'I', name: 'F or 10M chunk', logic: 'Rule F, or exactly 10M (the per-transaction cap)', caught: 99.4, moneySaved: 99.8, blocked: 2920, per10k: 4.6 },
]

export const missedByF = { missed: 195, at10M: 145 }

// Filled from dashboard_data.json (Colab cell 10). Empty arrays render a "data coming" note.
export const byHour: { hour: number; n: number; fraud: number }[] = []
export const byAmount: { band: string; n: number; fraud: number }[] = []
