# Revolut product case study: customers locked out of their money

**Question:** what makes Revolut customers angriest, and what product change would help most?

**Answer in one line:** 53.3% of 1–2 star Play Store reviews come from customers locked out of their money (can't log in, account frozen, stuck in verification), and Revolut, unlike Monzo and Wise, gives them no timeline or progress view. I propose an in-app **Account Review Tracker**.

## What's in this repo
| Step | What | File |
|---|---|---|
| 1. Data | 2,500 unique English Revolut Play Store reviews, 7 Oct – 23 Nov 2026, collected with Python (`google-play-scraper`) | [`data/reviews_2026-11-23.csv`](data/reviews_2026-11-23.csv), [`Revolut_reviews.ipynb`](Revolut_reviews.ipynb) |
| 2. Analysis | 9 complaint themes tagged with keyword rules (pandas), counted with SQL (DuckDB) | [`docs/01-data-findings.md`](docs/01-data-findings.md) |
| 3. Research | Problem statement and how Monzo, Wise and Revolut handle a locked account | [`docs/02-problem-and-research.md`](docs/02-problem-and-research.md) |
| 4. PRD | Account Review Tracker: requirements, metrics, roadmap, risks | [`docs/03-prd-account-review-tracker.md`](docs/03-prd-account-review-tracker.md) |
| 5. Prototype | Clickable React prototype: home alert, review tracker, document upload, essentials request | [`prototype/`](prototype/) · live: https://layahilarius.github.io/revolut-po-case-study/ |
| 6. User testing | 5 users, 2 tasks | _coming soon_ |

## Key numbers
| Theme | Share of all 1–2 star reviews | Avg rating |
|---|---|---|
| Can't access app or money | 36.5% | 1.65 |
| Support didn't help | 25.1% | 2.38 |
| Transfers | 18.4% | 2.87 |
| Account frozen | 14.9% | 1.32 |
| Verification | 13.0% | 1.83 |

## Notes
- The `country` column comes from the scraper setting and is not meaningful: the India and UK requests returned the same reviews, which were de-duplicated.
- The `app_bugs` column in the CSV is from a first tagging pass; the final analysis uses `app_access`.
- Keyword tagging is approximate. Hand-checking a sample for accuracy is the next improvement.
