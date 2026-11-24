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

// From dashboard_data.json (Colab cell 10), transfers and cash-outs only.
export const byHour: { hour: number; n: number; fraud: number }[] = [{"hour": 0, "n": 18214, "fraud": 300}, {"hour": 1, "n": 6005, "fraud": 358}, {"hour": 2, "n": 1922, "fraud": 372}, {"hour": 3, "n": 780, "fraud": 326}, {"hour": 4, "n": 512, "fraud": 274}, {"hour": 5, "n": 632, "fraud": 366}, {"hour": 6, "n": 904, "fraud": 358}, {"hour": 7, "n": 2542, "fraud": 328}, {"hour": 8, "n": 10302, "fraud": 368}, {"hour": 9, "n": 120028, "fraud": 341}, {"hour": 10, "n": 187024, "fraud": 375}, {"hour": 11, "n": 198240, "fraud": 324}, {"hour": 12, "n": 218561, "fraud": 339}, {"hour": 13, "n": 213906, "fraud": 346}, {"hour": 14, "n": 199362, "fraud": 353}, {"hour": 15, "n": 188136, "fraud": 341}, {"hour": 16, "n": 200906, "fraud": 345}, {"hour": 17, "n": 202806, "fraud": 353}, {"hour": 18, "n": 270681, "fraud": 343}, {"hour": 19, "n": 299933, "fraud": 342}, {"hour": 20, "n": 238889, "fraud": 340}, {"hour": 21, "n": 90926, "fraud": 347}, {"hour": 22, "n": 61164, "fraud": 351}, {"hour": 23, "n": 38034, "fraud": 323}]
export const byAmount: { band: string; n: number; fraud: number }[] = [{"band": "1. <10k", "n": 78841, "fraud": 278}, {"band": "2. 10k-100k", "n": 757271, "fraud": 1429}, {"band": "3. 100k-1M", "n": 1803790, "fraud": 3800}, {"band": "4. 1M-10M", "n": 124857, "fraud": 2419}, {"band": "5. 10M", "n": 5650, "fraud": 287}]
