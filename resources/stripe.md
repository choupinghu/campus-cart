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

## Stripe Dashboard (test mode)

Log in at [dashboard.stripe.com](https://dashboard.stripe.com) → toggle **Test mode** → Payments → see the PaymentIntent created during demo.
