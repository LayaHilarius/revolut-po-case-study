# 1. Data findings (Revolut Google Play reviews)

**Dataset:** 2,500 unique English reviews of the Revolut app (`com.revolut.revolut`), 7 Oct – 23 Nov 2026, collected with Python (`google-play-scraper`). 685 are angry (1–2 stars).
**Method:** 9 complaint themes tagged by keyword rules (regex in pandas), counted with SQL (DuckDB). A review can carry several themes. 30 untagged angry reviews were read by hand to fix missed keywords; most remaining untagged angry reviews are vague ("awful", "rubbish").

| Theme | Reviews | Avg rating | % negative | Share of all angry reviews |
|---|---|---|---|---|
| app_access (can't get in: crash, PIN, won't open) | 300 | 1.65 | 83.3% | 36.5% |
| support | 270 | 2.38 | 63.7% | 25.1% |
| transfers | 252 | 2.87 | 50.0% | 18.4% |
| frozen_account | 111 | 1.32 | 91.9% | 14.9% |
| verification | 114 | 1.83 | 78.1% | 13.0% |
| cards | 161 | 3.06 | 47.2% | 11.1% |
| scam_fraud | 64 | 1.86 | 75.0% | 7.0% |
| breach_outage | 62 | 1.87 | 72.6% | 6.6% |
| fees | 76 | 2.62 | 56.6% | 6.3% |

**Headline:** 53.3% of angry reviews are customers locked out of their money (app_access OR frozen_account OR verification). 27.4% of those also complain about support.

**Limitation (say this in interviews):** keyword tagging is approximate; a hand-check of a sample is the next step to measure accuracy.
