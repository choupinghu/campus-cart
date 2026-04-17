import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma.js';
import { requireAuth } from '../auth.js';
import { getStripe } from '../../services/stripe.js';

export const paymentResolvers = {
    Mutation: {
        createPaymentIntent: async (_parent, { listingId }, context) => {
            const user = requireAuth(context);

            const listing = await prisma.listing.findUnique({ where: { id: listingId } });

            if (!listing) {
                throw new GraphQLError('Listing not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }
            if (listing.status !== 'active') {
                throw new GraphQLError('This listing is no longer available', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            if (listing.sellerId === user.id) {
                throw new GraphQLError('You cannot purchase your own listing', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }

            const amountInCents = Math.round(listing.price * 100);

            const intent = await (await getStripe()).paymentIntents.create({
                amount: amountInCents,
                currency: 'sgd',
                metadata: {
                    listingId: listing.id,
                    buyerId: user.id,
                    listingTitle: listing.title,
                },
            });

            const order = await prisma.order.create({
                data: {
                    listingId: listing.id,
                    buyerId: user.id,
                    paymentIntentId: intent.id,
                    amount: listing.price,
                    currency: 'sgd',
                    status: 'pending',
                },
            });

            return {
                clientSecret: intent.client_secret,
                orderId: order.id,
                amount: listing.price,
                currency: 'sgd',
            };
        },
    },
};
