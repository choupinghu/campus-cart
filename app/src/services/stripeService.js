import { loadStripe } from '@stripe/stripe-js';

// Loaded once at module level — Stripe.js is fetched from Stripe's CDN
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
