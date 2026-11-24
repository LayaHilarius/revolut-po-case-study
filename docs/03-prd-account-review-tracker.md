# PRD: Account Review Tracker

**Author:** Laya H · **Status:** Draft v1 · **Date:** 24 Nov 2026
**Product area:** Revolut Retail app → Account & Security

## 1. Problem
When Revolut restricts or reviews an account, customers don't know **why**, **what to do**, or **how long** it will take, and support agents can't tell them. They lose access to their money and loop through chat.

**Evidence**
- 53.3% of 1–2 star Play Store reviews (2,500 reviews, 7 Oct – 23 Nov 2026) are customers locked out of their money (access, frozen account, verification).
- Frozen-account reviews average **1.32 stars**, the angriest theme; 27.4% of locked-out reviews also say support didn't help.
- Revolut's own help page says agents can't share why or how long during a standard check. Monzo tells customers most reviews finish within 2 days; Wise shows an estimated resolution time in the app. Revolut shows neither.

## 2. Target user
An existing Revolut customer whose account is restricted or under review (identity, source of funds, unusual activity). They are anxious, often need money for something today, and their only channel is in-app chat.

## 3. Goals and non-goals
**Goals**
1. Customers always know the **stage**, the **next action**, and an **estimated time** of their review.
2. Customers can complete what Revolut needs **in one place**, without chat.
3. Fewer repeat support contacts during a review.

**Non-goals**
- Changing fraud or compliance rules, or how many reviews happen.
- Showing the specific risk reason when the law doesn't allow it (e.g. "tipping-off" rules).

## 4. Solution: in-app Account Review Tracker
A card on the home screen that opens a tracker page when an account is under review.

| Priority | Requirement | Why |
|---|---|---|
| **Must** | Stage tracker: *Review started → Info needed from you → Documents received → Under review → Decision* | Answers "what's happening?" without needing the reason |
| **Must** | "What we need from you" checklist with in-app upload and due date | Removes the chat loop for document requests |
| **Must** | Estimated time range per stage (e.g. "usually 1–2 days"), updated when the stage changes | Monzo and Wise both set expectations; Revolut doesn't |
| **Must** | Clear message of what still works (e.g. "You can still receive money; card payments are paused") | Customers panic when they don't know what's blocked |
| **Should** | Push notification on every stage change | Customer stops checking chat for updates |
| **Should** | "I need money for essentials" request (rent, food, medicine) routed to a priority queue | Monzo offers this; it targets the most urgent cases |
| **Should** | Agent view shows the same tracker, so chat answers match the app | Fixes "every new agent seems clueless" |
| **Could** | Self-service appeal for closures, with status | Wise has this for closures |

## 5. Success metrics
- **Primary:** repeat support contacts per restricted account during a review. Target: −30%.
- **Supporting:** % of info requests completed within 24 hours (target +20%); 1–2 star reviews mentioning frozen, blocked or verification (target −25% in 3 months).
- **Guardrails:** fraud losses and compliance case quality must not get worse; review time must not increase.

## 6. Roadmap
| Release | Scope | Timing |
|---|---|---|
| **MVP** | Stage tracker, "what we need" checklist with upload, estimated time, what-still-works message | Quarter 1 |
| **v2** | Push notifications, agent view of the tracker | Quarter 2 |
| **v3** | Essentials request, self-service appeal | Quarter 3 |

## 7. Risks and open questions
- **Legal:** which stages and wording are allowed without "tipping off"? Needs Compliance sign-off before design is final.
- **Estimated time accuracy:** a wrong estimate is worse than none. Start with ranges by review type, from historical data.
- **Ops capacity:** an essentials queue needs staffing. Size the expected volume first.
- **Teams involved:** Design, Engineering (app + case-management API), Operations (FinCrime review), Compliance, Support.

## 8. Validation plan
Clickable prototype (React) tested with 5 users on two tasks: "find out what Revolut needs from you" and "find out when you'll get access back". Success = 4 of 5 complete both without help.
