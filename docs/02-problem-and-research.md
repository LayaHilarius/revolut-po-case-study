# 2. Problem statement and competitive research

## Problem statement
**Revolut customers who get locked out of their account don't know why, what to do, or how long it will take, and support can't tell them.**
- **Who:** existing customers whose account is restricted, under review, frozen, or who can't log in.
- **Evidence:** 53.3% of 1–2 star reviews (7 Oct – 23 Nov 2026) are about being locked out of money; frozen-account reviews average 1.32 stars (the angriest theme); 27.4% of locked-out reviews also complain that support didn't help.
- **Why it matters to Revolut:** being locked out of your money is the moment trust breaks. It drives 1-star reviews, repeat support chats (cost), account closures (churn), and complaints to regulators/ombudsman.
- **What we are NOT trying to do:** remove fraud or compliance checks. Revolut must run them. We want the *experience during* a check to be clear.

## How competitors handle the same moment (from their public help pages, Nov 2026)
| | Reason shown | Timeline | In-app status | What the customer can do | Human help |
|---|---|---|---|---|---|
| **Monzo** | Generic ("not your fault") | "Most within a couple of hours, almost all within 2 days" | Review details + in-app messages; "no need to contact us for updates" | Upload/reply in app; flag urgent needs (food, medicine); wellbeing team | In-app chat |
| **Wise** | Generic, with a list of typical reasons | No fixed time, but **estimated resolution time shown in the app** | Estimated resolution time | Respond to requests, upload documents; self-service appeal for closures | Support exists but says it can't speed up a review |
| **Revolut (today)** | Partly specific examples (ID, source of funds, tax info) | **None given** | **No progress view described**; in-app prompts + email | Follow in-app prompts, upload documents | Live-agent chat, but agents **can't say why or how long** |

Sources: monzo.com/help/account-and-profile/your-account-is-under-review · monzo.com/ie/help/keeping-your-account-secure/help-locked-money · wise.com/help/articles/1e5Yyfl91yUaDNGkBNcEhw · wise.com/help/articles/4iI8qrjPXnkWFgg0tNhPvY · help.revolut.com/help/profile-and-plan/security-and-personal-data/my-account-is-locked/why-is-my-account-locked/ · revolut.com/blog/post/why-has-my-account-been-locked-and-how-to-regain-access/

## Takeaways
1. **Monzo sets expectations** ("most reviews finish within 2 days") and tells people they don't need to chase support. That cuts repeat contacts.
2. **Wise shows an estimated resolution time** in the app, even without giving the reason.
3. **Monzo has an "essentials" path** for urgent needs during a review.
4. **Revolut's gap:** no timeline, no progress view, and agents can't add information, so customers loop through chat (the reviews say exactly this).

## Opportunity (goes into the PRD)
An in-app **"Account review tracker"**: shows the stage of the review, exactly what Revolut needs from you (with upload), an estimated time, and a way to request access for essentials, so customers stop chasing support.
