# Fraud rules vs. good customers (SQL)

**Question:** which fraud rule stops the most fraud money while blocking the fewest genuine customers?

**Why it matters:** a rule that's too loose loses money; a rule that's too strict locks good customers out of their money, which is the #1 cause of 1–2 star Revolut reviews in [Project 1](../docs/01-data-findings.md) (53.3%).

## Data
[PaySim](https://www.kaggle.com/datasets/ealaxi/paysim1): 6,362,620 simulated mobile-money transactions over 30 days (744 hours), each labelled fraud or not. Queried with SQL in DuckDB inside Google Colab.

## What I found
**1. Fraud only happens in two transaction types.**

| type | transactions | frauds | fraud rate | fraud value (millions) |
|---|---|---|---|---|
| CASH_OUT | 2,237,500 | 4,116 | 0.184% | 5,989 |
| TRANSFER | 532,909 | 4,097 | 0.769% | 6,067 |
| PAYMENT, CASH_IN, DEBIT | 3,592,211 | 0 | 0% | 0 |

Everyday payments never need to be checked. Fraud is rare (0.13% overall), so a careless rule easily blocks more good customers than fraudsters.

**2. "The account was emptied" is a strong signal but blocks too many good customers.** 97.6% of frauds empty the sender's account, but so do 42.7% of genuine transfers and cash-outs (≈1.18M transactions).

**3. Rule comparison**

| Rule | Fraud caught | Fraud money saved | Good customers blocked | Blocked per 10k good |
|---|---|---|---|---|
| A. Current rule (transfer > 200k, `isFlaggedFraud`) | 0.2% | 0.6% | 0 | 0 |
| B. Account emptied (transfer or cash-out) | 97.6% | 87.5% | 1,180,062 | 1,857 |
| C. Transfer that empties the account | 47.9% | 37.9% | 224,728 | 354 |
| D. C + amount > 100k | 37.6% | 37.6% | 209,558 | 330 |
| E. Emptied + amount > 200k | 64.5% | 85.6% | 601,066 | 946 |
| **F. Moves exactly the full balance** | **97.6%** | **87.7%** | **0** | **0** |
| G. F, transfers only | 48.0% | 38.1% | 0 | 0 |
| H. F, midnight–6 AM only | 23.9% | 21.9% | 0 | 0 |
| **I. F OR exactly 10M (max single transaction)** | **99.4%** | **99.8%** | **2,920** | **4.6** |

**4. Why F misses some fraud:** of the 195 frauds F misses, 145 are exactly 10,000,000, the simulator's per-transaction cap. Fraudsters drain rich accounts in 10M chunks, so a chunk never equals the full balance.

## Recommendation
- **Block** on rule F (exact full-balance transfer or cash-out): it stops 87.7% of fraud money and, in this data, blocks no genuine customers.
- **Step up, don't block** on the extra 10M-chunk signal from rule I: ask for a biometric or in-app confirmation instead of freezing the account. That recovers fraud money up to 99.8% while the 2,920 genuine customers (4.6 per 10,000) get a quick check instead of a lock-out.
- Any customer who *is* blocked goes into the Account Review Tracker from Project 1, so they know what's happening and how long it will take.

## Limits (important)
- PaySim is **simulated**. Its fraud generator always drains the exact balance, which makes rule F look perfect. Real fraudsters vary, so real-world false blocks will be higher.
- Before launching, I'd run the rule in **shadow mode** (flag, don't block) for 2–4 weeks and measure fraud caught and genuine customers flagged on live traffic.
- Guardrails: customer complaints about blocks, support contacts per blocked account, and time-to-unblock must not rise.

## SQL used
See [`queries.sql`](queries.sql). The core pattern scores every rule in one query with `CASE WHEN ... THEN 1 ELSE 0 END` and stacks the rules with `UNION ALL`.
