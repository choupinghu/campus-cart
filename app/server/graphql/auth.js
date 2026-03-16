import { GraphQLError } from 'graphql';

/**
 * Helper to get the authenticated user from context.
 * Throws an UNAUTHENTICATED GraphQL error if not signed in.
 */
export function requireAuth(context) {
    if (!context.user) {
        throw new GraphQLError('You must be signed in.', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    return context.user;
}
