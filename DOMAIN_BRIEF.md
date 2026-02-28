# Domain Knowledge Brief — Payment Gateway / Stripe Integration Hub

## Sub-Domain Classification

**Stripe-integrated payment gateway operations dashboard** — a developer-facing operations console used by a technical team (developers, payment ops, finance) to monitor and manage payment flows, detect failures, handle disputes, and track settlement performance across a multi-merchant or single-merchant PHP/JavaScript web application. Typical business profile: SaaS platform or e-commerce site processing $50K–$2M/month, developer-led payments team of 1-5 people, using Stripe as primary processor with PHP backend.

---

## Job Analyst Vocabulary — Confirmed and Extended

The Job Analyst correctly classified this as Fintech / Payment Processing. The client vocabulary centers on Stripe-specific API terminology, compliance concepts, and payment operations workflows. All terms below are verified against Stripe's official API documentation and industry usage.

### Confirmed Primary Entity Names

These are the exact words that must appear in every UI label — sidebar nav, table headers, KPI card titles, status badges, search placeholders.

- **Primary record type:** `Payment` (or `Charge` in legacy Stripe context — use "Payment" for modern API; "Charge" for historical records)
- **High-level abstraction:** `PaymentIntent` — the core Stripe object that tracks a payment lifecycle
- **People roles:** `Customer` (Stripe object), `Merchant` (business receiving funds), `Cardholder` (person being charged), `Developer` (integration owner)
- **Secondary entities:** `Payout`, `Refund`, `Dispute`, `Invoice`, `Subscription`, `SetupIntent`, `Transfer`, `Balance Transaction`
- **Document types:** `Receipt`, `Invoice`, `Statement`, `Settlement Report`

### Expanded KPI Vocabulary

Beyond generic "revenue" — the exact metric names Stripe practitioners track:

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Gross Volume | Total payment attempts × amount (including failed) | $, formatted with M/K suffix |
| Net Volume | Gross Volume minus refunds and disputes | $ |
| Payment Success Rate | Successful charges / total attempted charges | % (target: 95%+) |
| Authorization Rate | PaymentIntents that reach `succeeded` / all created | % (target: 93%+) |
| Chargeback Rate | Disputes filed / total transactions in period | % (danger: >1%; Stripe threshold: 0.75%) |
| Dispute Win Rate | Disputes merchant won / total disputes submitted | % |
| Refund Rate | Refunds issued / total transactions | % (healthy: <2%) |
| Average Transaction Value (ATV) | Net Volume / Transaction Count | $ |
| Payout Frequency | How often funds settle to bank | Days (Stripe default: 2 business days) |
| Processing Fee (Effective Rate) | Total fees paid / Gross Volume | % (typical: 2.5–3.2%) |
| Failed Payment Rate | Failed charges / total attempts | % (investigate if >5%) |
| Decline Rate | Declined by issuer / total attempts | % |
| 3DS Authentication Rate | Transactions requiring 3DS / total card txns | % |
| Fraud Rate | Radar-flagged or disputed as fraud / total | % (healthy: <0.1%) |
| MRR (Monthly Recurring Revenue) | For subscription billing contexts | $ |
| Net Revenue Retention (NRR) | Revenue retained from cohort including expansion | % (>100% = healthy SaaS) |

### Status Label Vocabulary

Exact status strings from the Stripe API — these go directly into data tables, badges, and filter dropdowns:

**PaymentIntent statuses (Stripe-canonical):**
- Active states: `requires_payment_method`, `requires_confirmation`, `requires_action`, `processing`
- Success state: `succeeded`
- Problem states: `requires_capture` (uncaptured auth), `canceled`

**Simplified display labels (for UI — not raw API strings):**
- Active states: `Processing`, `Awaiting Confirmation`, `Action Required`, `Pending Capture`
- Success state: `Succeeded` / `Paid`
- Problem states: `Failed`, `Canceled`, `Refunded`, `Partially Refunded`

**Dispute statuses:**
- `needs_response`, `under_review`, `warning_needs_response`, `won`, `lost`, `charge_refunded`

**Payout statuses:**
- `paid`, `pending`, `in_transit`, `canceled`, `failed`

**Refund statuses:**
- `succeeded`, `pending`, `failed`, `canceled`

### Workflow and Action Vocabulary

Verbs used in this domain — these become button labels, action menu items, and empty state messages:

- **Primary actions:** `Capture`, `Refund`, `Dispute`, `Retry`, `Cancel`, `Confirm`, `Authorize`, `Void`
- **Secondary actions:** `Respond to Dispute`, `Accept Dispute`, `Escalate`, `Export`, `Reconcile`, `Generate Report`, `Add Evidence`, `Resend Receipt`
- **Automated actions (webhook-driven):** `charge.succeeded`, `charge.failed`, `charge.dispute.created`, `invoice.payment_failed`, `customer.subscription.deleted`

### Sidebar Navigation Candidates

Domain-specific nav items — not generic "Dashboard / Analytics / Settings":

1. **Payments** (transaction feed — main operations surface)
2. **Disputes** (chargeback management with response queue)
3. **Payouts** (settlement history and bank transfer status)
4. **Customers** (Stripe Customer objects with payment methods)
5. **Subscriptions** (recurring billing management, if applicable)
6. **Webhooks** (event log and delivery status)
7. **Reports** (settlement, reconciliation, tax documents)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Payment operations dashboards are built for developers and finance teams who live in terminal windows and spreadsheets. The visual language is deliberately restrained: clean whitespace, monospace fonts for IDs and amounts, a neutral (near-white or light gray) background that never distracts from data. Color is functional, not decorative — green signals success, red signals failure, amber signals warning. This is non-negotiable in payments; practitioners have internalized these conventions from years of looking at Stripe, PayPal, and Square dashboards.

The information density sits at medium-compact: you want to see a full page of transactions without scrolling, but each row needs breathing room to scan. Long transaction IDs (`pi_3OXmNk2eZvKYlo2C1t8K9dJo`) are shown in monospace with truncation and a copy-to-clipboard interaction — this is a mandatory UX pattern in payment tools, not an enhancement.

Filter and search capabilities are essential — practitioners filter by date range, status, payment method, currency, and customer constantly. A payments table without robust filtering feels like a toy. Similarly, export-to-CSV functionality is expected on every data surface.

### Real-World Apps Clients Would Recognize as "Premium"

1. **Stripe Dashboard** — The canonical reference for all payment ops tools. Ultra-clean, Stripe's own inter-inspired typography, data-first layout. Left sidebar with icon + label nav, stat cards at top with sparkline deltas, transaction table as primary surface. Green/red status badges. Amount always right-aligned in a consistent format. The industry baseline that all practitioners compare against.

2. **Brex** — A step-up from Stripe: card-based UI with spend categories, monospace IDs, rich filtering. Shows how to build on the Linear/Minimal aesthetic while adding more data depth. Practitioners in finance ops immediately recognize it as "the good version."

3. **Mercury** (banking for startups) — Excellent reference for showing balance + payout state. Clean single-column transaction list with merchant logo placeholders, clear timestamp formatting, amount formatting conventions. Less dense than Stripe but same vocabulary.

### Aesthetic Validation

- **Job Analyst likely chose**: Linear/Minimal (confirmed correct for finance/payment ops)
- **Domain validation**: Confirmed — payment developers spend 80%+ of their time in Stripe's own dashboard and expect the same visual grammar. Linear/Minimal with emerald/green primary accent is the authentic signal. Stripe's own design language is the closest real-world equivalent.
- **One adjustment**: Lean slightly more data-dense than the default Linear/Minimal — payment tables are the primary surface, not cards. Reduce `--content-padding` to `1rem`, `--card-padding` to `1rem`. Standard 0.5rem radius is correct for this domain (Stripe uses 6-8px radius throughout).

### Format Validation

- **Job Analyst chose**: `dashboard-app` (confirmed correct)
- **Domain validation**: Confirmed — this is backend payment integration work. The deliverable is a payment operations dashboard, not a consumer-facing product. Sidebar layout with transaction table as main surface is exactly what payment developers build. `mobile-app-preview` would be wrong — this is clearly a web ops tool.
- **Format-specific design notes for the Demo Screen Builder**: The hero metric should be Gross Volume (largest number, most impressive). Transaction table is the primary surface on the main dashboard. The sidebar should show "Payments" as the active default nav item. Status badges must use green (succeeded), red (failed/disputed), amber (pending/action-required) — these are non-negotiable payment conventions. Include a real-time webhook event log panel on the dashboard to signal integration depth.

### Density and Layout Expectations

Medium-compact density — payment tables need to show 15-20 rows without scrolling on a standard laptop screen. Each row: date, payment ID (monospace, truncated), customer, amount (right-aligned), payment method (card brand icon + last 4), status badge, actions. List-heavy views dominate — this is a table-first domain. Card views are used for individual payment/dispute detail pages, not for lists.

---

## Entity Names (10+ realistic names)

### Companies / Organizations (Merchants / Businesses)

Real naming conventions: often DBA names, SaaS product names, or e-commerce brand names:

- Northcraft Supply Co.
- Vellum Digital Studio
- Archway Fitness
- Meridian Learning Platform
- Saltwater Commerce
- Brightpath Consulting
- Fenway Tech Solutions
- Cascade Media Group
- Solaris Print Shop
- Harbor Street Market
- Ridgeline SaaS Inc.
- Cobalt Cloud Services

### People Names (Customers / Cardholders)

Demographically appropriate for a US/global e-commerce or SaaS customer base:

- Priya Nair
- James Kowalski
- Sofia Reyes
- Marcus Webb
- Yuna Park
- Daniel Ferreira
- Anika Sharma
- Tyler Hoffman
- Camille Rousseau
- Ahmad Khalil
- Olivia Chen
- Ben Nakashima

### Payment Methods / Card Brands / Products

Used in payment method column and filter dropdowns:

- Visa (ending in 4242)
- Mastercard (ending in 5555)
- American Express (ending in 0005)
- Discover (ending in 6011)
- Apple Pay
- Google Pay
- ACH Direct Debit
- SEPA Direct Debit
- Link (Stripe's accelerated checkout)
- BACS Direct Debit (UK)
- Klarna
- Afterpay

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Monthly Gross Volume | $12,000 | $180,000 | $2,400,000 | Small business to mid-market SaaS/e-com |
| Average Transaction Value | $18 | $87 | $640 | E-commerce: lower; SaaS/B2B: higher |
| Daily Transaction Count | 8 | 340 | 4,200 | Correlates with volume tier |
| Payment Success Rate | 88% | 95.4% | 99.1% | Stripe industry average ~94-96% |
| Chargeback Rate | 0.02% | 0.42% | 1.1% | Stripe threshold: 0.75%; Visa: 1% |
| Dispute Win Rate | 15% | 38% | 62% | With strong evidence/documentation |
| Refund Rate | 0.3% | 1.7% | 4.8% | Digital goods: lower; physical: higher |
| Effective Processing Fee | 2.1% | 2.9% | 3.5% | Stripe: 2.9% + $0.30 standard |
| Payout Settlement Time | 1 day | 2 days | 7 days | Standard: T+2; instant available at cost |
| Failed Payment Retry Success | 12% | 31% | 58% | Smart retry logic significantly improves |
| Stripe Radar Fraud Score | 0 | 22 | 98 | 0-100 scale; >75 typically blocked |
| 3DS Authentication Rate | 2% | 18% | 55% | EU/UK: higher due to SCA mandate |
| Active Subscriptions | 12 | 340 | 8,200 | Recurring billing context |
| Invoice Collection Rate | 78% | 91% | 99% | Dunning/retry campaigns impact this |

---

## Industry Terminology Glossary (15+ terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| PaymentIntent | Stripe API object that tracks a payment's full lifecycle from creation to confirmation | Core transaction entity in all Stripe integrations |
| SetupIntent | Stripe object used to collect payment method details for future use without charging | Subscription setup, saved card workflows |
| Charge | Legacy Stripe API object; now wrapped by PaymentIntents but still referenced in older integrations | Historical data, PHP SDK older patterns |
| Webhook | HTTP callback that Stripe sends to notify your server of payment events | Integration plumbing; reliability is critical |
| Idempotency Key | Unique key sent with API requests to prevent duplicate charges if the request is retried | Required on all write operations |
| Payout | Transfer of settled funds from Stripe balance to merchant's bank account | Settlement workflow |
| Balance Transaction | Every financial movement in Stripe (charges, refunds, fees, payouts) creates one | Reconciliation and accounting |
| Dispute | Chargeback or inquiry filed by cardholder against a charge | Risk management, requires merchant response |
| Chargeback | Forced reversal of a charge initiated by the card issuer on behalf of cardholder | The highest-stakes failure state |
| Radar | Stripe's built-in fraud detection system using ML risk scoring | Risk management |
| PCI DSS | Payment Card Industry Data Security Standard — compliance framework for handling card data | Compliance, SAQ A for Stripe.js integrations |
| 3D Secure (3DS) | Additional authentication step (OTP, biometric) required by card issuer for high-risk transactions | EU SCA compliance, chargeback liability shift |
| SCA | Strong Customer Authentication — EU/UK regulation requiring two-factor auth on online payments | Regulatory context for European businesses |
| Interchange Fee | Fee paid to card-issuing bank per transaction; largest component of processing cost | Cost analysis |
| ACH | Automated Clearing House — US bank-to-bank transfer network used for direct debit | Alternative to card payments; lower fees |
| Dunning | Automated process of retrying failed recurring payments with escalating communication | Subscription revenue recovery |
| Settlement | Final transfer of funds from card network to merchant's Stripe balance | End of payment lifecycle |
| Net Volume | Gross volume minus refunds, disputes, and adjustments | True revenue metric |
| Capture | Second step in auth-and-capture flow where the authorized hold is converted to a charge | Used in hotel/car rental contexts |
| Void | Canceling an authorization before capture — no funds move | Pre-capture cancellation |
| MCC | Merchant Category Code — 4-digit code classifying business type for interchange rates | Compliance, interchange optimization |
| Radar Rule | Custom rule in Stripe Radar to block or allow specific payment patterns | Fraud prevention |

---

## Common Workflows

### Workflow 1: Standard Card Payment (PaymentIntent Lifecycle)

1. Customer initiates checkout
2. Frontend creates PaymentIntent via Stripe.js (`payment_intent.create`)
3. PaymentIntent status: `requires_payment_method`
4. Customer enters card details in Stripe Elements iframe
5. Frontend confirms PaymentIntent (`confirmCardPayment`)
6. Stripe checks Radar fraud score — blocks if over threshold
7. If 3DS required: status transitions to `requires_action`, customer completes authentication
8. Stripe sends to card network for authorization
9. Issuer authorizes or declines
10. On success: PaymentIntent status → `succeeded`; `charge.succeeded` webhook fires
11. Server receives webhook, fulfills order, sends receipt
12. Funds settle to Stripe balance (T+2 standard)
13. Payout to bank account on schedule

### Workflow 2: Dispute (Chargeback) Response

1. Cardholder contacts bank, claims unauthorized/invalid charge
2. Bank files chargeback, Stripe creates `Dispute` object
3. `charge.dispute.created` webhook fires to merchant server
4. Dispute status: `needs_response` (merchant has 7-21 days to respond)
5. Merchant gathers evidence: order details, shipping confirmation, customer communication, IP logs
6. Merchant submits evidence via Stripe Dashboard or API
7. Dispute status: `under_review`
8. Card network reviews (30-90 days)
9. Outcome: `won` (funds returned) or `lost` (merchant absorbs charge + $15 Stripe fee)
10. If chargeback rate exceeds Visa's 1% threshold: merchant placed in monitoring program

### Workflow 3: Failed Payment Recovery (Subscription Dunning)

1. Subscription renewal charge fails (insufficient funds, expired card, etc.)
2. `invoice.payment_failed` webhook fires
3. Stripe's Smart Retries automatically schedules retry (uses ML to pick optimal retry times)
4. Retry attempts: typically 3-4 over 14-21 days
5. Customer receives payment failure email (configurable in Stripe)
6. Customer updates payment method via customer portal
7. Invoice retried immediately after update
8. If all retries fail: subscription status → `past_due` → `canceled`
9. Revenue lost unless recovered via manual outreach

---

## Common Edge Cases

1. **Card declined — insufficient funds**: `decline_code: insufficient_funds` — most common failure. Retry in 3-5 days often succeeds.
2. **Card expired**: PaymentMethod has expired `exp_month`/`exp_year` — requires customer to update. Card networks sometimes provide updated card data via Account Updater.
3. **Fraud block by Radar**: `outcome.type: blocked` — Radar rule or fraud score triggered block before authorization attempt. Legitimate customers occasionally blocked (false positive).
4. **3DS authentication failed**: Customer fails or abandons 3DS flow — PaymentIntent status returns to `requires_payment_method`. Common cause of cart abandonment in EU.
5. **Disputed charge — friendly fraud**: Customer claims they didn't authorize a charge they actually made. Win rate ~35-40% with strong evidence (IP, delivery confirmation, customer communication).
6. **Webhook delivery failure**: Stripe retries webhook delivery for 3 days with exponential backoff. If endpoint is down, events queue up — critical to process `charge.succeeded` exactly once.
7. **Duplicate charge (missing idempotency key)**: Without idempotency key on retry logic, network errors can cause customer to be charged twice. Stripe idempotency key prevents this.
8. **Payout failure**: Bank account details changed or account closed — payout returns to Stripe balance. `payout.failed` webhook required to alert team.
9. **High-value transaction hold**: Transactions over certain thresholds may be held for review before payout — common for new accounts or unusual activity spikes.
10. **Partial refund edge case**: Partial refund issued, customer disputes the remaining charge — dispute covers full original amount, creating reconciliation complexity.

---

## What Would Impress a Domain Expert

1. **PaymentIntent IDs in `pi_` format with proper Stripe ID structure** — e.g., `pi_3OXmNk2eZvKYlo2C1t8K9dJo`. A developer will immediately recognize this as authentic Stripe API formatting. Using "TXN-12345" breaks the illusion instantly.

2. **Webhook event log with retry indicators** — showing `charge.succeeded`, `payment_intent.created`, `customer.subscription.updated` event types with delivery attempt count and HTTP response code. This signals you've actually handled Stripe webhooks in production, where idempotency and retry handling are real problems.

3. **PCI DSS SAQ A compliance note** — indicating that card data never touches the server because Stripe.js/Elements handles card collection. Stripe developers are acutely aware of PCI scope reduction as a major selling point of using Stripe over rolling your own payment form.

4. **Dispute response deadline countdown** — showing days remaining to submit evidence. Card networks give merchants 7-21 days and practitioners know the exact deadline matters. "Respond by Mar 3" with a countdown indicator signals operations awareness.

5. **Stripe Radar score column** — showing fraud risk score (0-100) on transaction rows, with the threshold marker (typically 75+). This is the insider signal that you understand Stripe's machine learning fraud layer, not just the happy path payment flow.

---

## Common Systems and Tools Used

| Tool | Role |
|------|------|
| **Stripe Dashboard** | Primary payment operations console — the canonical reference |
| **Stripe CLI** | Local webhook forwarding, testing, event triggering |
| **Stripe Radar** | ML-based fraud detection and custom blocking rules |
| **Stripe Billing / Invoicing** | Subscription and invoice management |
| **Stripe Sigma** | SQL-based analytics on Stripe data (premium feature) |
| **Datadog / New Relic** | Payment API monitoring, webhook delivery tracking |
| **PagerDuty** | Alerting on payment failure spikes, webhook downtime |
| **Sentry** | Error tracking for failed payment flows, webhook handler exceptions |
| **QuickBooks / Xero** | Accounting integration for Stripe payouts and reconciliation |
| **Chargeflow / Chargebacks911** | Third-party dispute management automation |

---

## Geographic / Cultural Considerations

- **US-primary** (based on job context), so USD as default currency, US card networks (Visa, Mastercard, Amex, Discover)
- **EU/UK compliance awareness**: SCA (Strong Customer Authentication) and PSD2 mean 3DS is mandatory for EU/EEA transactions — include this as a compliance flag in the UI
- **Time zones**: Transaction timestamps should show UTC with local time in parentheses — Stripe stores all timestamps in UTC Unix epoch
- **Stripe's standard payout schedule**: 2 business days for US; 7 days for new accounts; 1-day available after 90 days of successful processing
- **Chargeback time limits**: Visa/Mastercard give cardholders 60-120 days to file a dispute; merchants get 7-21 days to respond — these numbers are critical in dispute management UI

---

## Data Architect Notes

- **Transaction IDs**: Use Stripe's real ID format: `pi_3O[22 alphanumeric chars]` for PaymentIntents, `ch_3O[22 alphanumeric chars]` for Charges, `re_[alphanum]` for Refunds, `dp_[alphanum]` for Disputes
- **Customer IDs**: Use `cus_[alphanum]` format
- **Event IDs**: Use `evt_[alphanum]` format for webhook events
- **Amounts**: Store in cents (integer) — display by dividing by 100 and formatting with currency symbol. Never use floats for money.
- **Metric ranges to use**: Success rate 94.2–97.8%, chargeback rate 0.28–0.84%, ATV $42–$380 depending on mock dataset, gross volume $87,340–$482,150/month for the demo period
- **Status labels (exact strings for type unions)**: `"succeeded" | "processing" | "requires_action" | "requires_payment_method" | "canceled" | "failed"` for PaymentIntents
- **Edge case records to include**: At least 2 disputes (`needs_response`, 1 `lost`), 3+ failed charges with different decline codes, 1 high-risk Radar block, 1 refund record, 1 partial refund, 1 payout failure, 1 expired card failure
- **Date patterns**: Last 30-90 days for transaction feed; last 12 months of monthly data for volume chart
- **Webhook events dataset**: 20+ events with timestamps, event types, delivery status (delivered/failed/retrying), HTTP response codes
- **Chart time-series**: Monthly gross volume for 12 months with realistic seasonal variation (Nov/Dec spike if e-commerce, steady growth curve if SaaS)

## Layout Builder Notes

- **Density**: Compact — payment tables need row density. Set `--content-padding: 1rem`, `--card-padding: 1rem`, `--nav-item-py: 0.375rem`
- **Sidebar width**: Standard 16rem — nav labels fit comfortably. No need to go wider.
- **Monospace for IDs and amounts**: Use `font-mono` (Geist Mono) on all payment IDs, customer IDs, and amount values. This is a non-negotiable payment UI convention.
- **Status badge colors**: Green (`--success`) for succeeded/paid, Red (destructive) for failed/disputed/lost, Amber (`--warning`) for pending/requires_action, Blue (`--primary`) for processing/in_transit
- **Primary color**: Emerald green — `oklch(0.52 0.15 160)`. Finance/payments is the one domain where green-as-primary is semantically correct (money, success, positive P&L). Do not use blue as primary.
- **Card treatment**: Minimal shadow, clean borders, no decorative gradients. Stripe's own UI has zero decorative shadows on cards.
- **Right-align amounts**: All monetary values in tables must be right-aligned — this is standard financial table convention.

## Demo Screen Builder Notes

- **Hero metric (largest stat card)**: Gross Volume for the current month ($482,150 or similar) with delta vs. last month (+12.3%)
- **Chart type**: Area chart for monthly gross volume trend (12 months) — area chart with slight fill communicates "money flow" better than bar chart for payment contexts
- **Secondary chart**: Bar chart for payment success rate by week (shows optimization narrative)
- **Domain-specific panel to include**: Webhook event log — real-time feed showing recent Stripe events (`charge.succeeded`, `charge.failed`, `payment_intent.created`) with event type, timestamp, delivery status badge, and retry count. This is the single most impressive insider panel for a Stripe developer client.
- **Transaction table**: Primary surface. Columns: `Date | Payment ID (mono) | Customer | Amount (right-aligned, mono) | Method (card icon + last4) | Status (badge) | Risk Score | Actions`
- **Dispute alert panel**: Show count of open disputes with "Responds by" urgency — this is the highest-stakes operational item for payment teams
- **Format**: `dashboard-app` confirmed — sidebar with Payments as default active nav item
