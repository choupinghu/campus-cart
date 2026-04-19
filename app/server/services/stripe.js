let _stripe = null;

export async function getStripe() {
    if (!_stripe) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key || key.startsWith('REPLACE')) {
            throw new Error(
                'Stripe is not configured. Add STRIPE_SECRET_KEY to your .env file.',
            );
        }
        const { default: Stripe } = await import('stripe');
        _stripe = new Stripe(key);
    }
    return _stripe;
}
