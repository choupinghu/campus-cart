# Stripe Payment — Demo Guide

## Test Card

| Field       | Value                          |
| ----------- | ------------------------------ |
| Card number | `4242 4242 4242 4242`          |
| Expiry      | Any future date (e.g. `12/30`) |
| CVC         | Any 3 digits (e.g. `123`)      |
| Name        | Anything                       |

## How to Demo

1. Log in as a user (e.g. `alice@u.nus.edu` / `Password123`)
2. Navigate to any listing **not created by alice**
3. Click **Buy Now** on the listing detail page
4. Modal opens → order summary + card form loads
5. Enter test card above → click **Pay S$ XX.XX**
6. Success state appears
7. Listing now shows **Sold** overlay

## Important

- Must be logged in as a **different user** than the seller — Buy Now is hidden for your own listings
- No real charge occurs — Stripe test mode only
- Order is recorded in DB with `status: pending` → `succeeded`

---

## Getting API Keys

API keys are **not committed to the repo**. Get them from a teammate or generate your own test keys:

### Option A — Get from teammate (fastest)
Ask for the `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` values via private message (Telegram/WhatsApp/NUS email). Never share in PR comments or Notion.

### Option B — Generate your own test keys (free)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create a free account (no credit card needed)
2. Make sure **Test mode** is toggled ON (top-right toggle)
3. Go to **Developers → API keys**
4. Copy:
   - **Publishable key** → starts with `pk_test_...`
   - **Secret key** → starts with `sk_test_...` (click Reveal)

### Add to `.env`

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Then restart the dev server (`pnpm dev`).

> **Note:** Test keys are safe to share with teammates — they cannot process real charges. Never commit live keys (`sk_live_...`) to the repo.

---

## Stripe Dashboard (test mode)

Log in at [dashboard.stripe.com](https://dashboard.stripe.com) → toggle **Test mode** → Payments → see the PaymentIntent created during demo.
