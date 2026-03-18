/**
 * GraphQL schema merge layer.
 * Imports typeDefs and resolvers from each domain module
 * and exports a unified schema for the server.
 *
 * To add a new domain (e.g. offers):
 *   1. Create offers/offers.schema.js and offers/offers.resolvers.js
 *   2. Import and add to the arrays/merge below
 */

import { listingsTypeDefs } from './listings/listings.schema.js';
import { listingsResolvers } from './listings/listings.resolvers.js';
import { profileTypeDefs } from './profile/profile.schema.js';
import { profileResolvers } from './profile/profile.resolvers.js';
import { requestsTypeDefs } from './requests/requests.schema.js';
import { requestsResolvers } from './requests/requests.resolvers.js';

// Merged typeDefs — array format is natively supported by makeExecutableSchema
export const typeDefs = [listingsTypeDefs, profileTypeDefs, requestsTypeDefs];

// Deep-merge resolvers from all domain modules
export const resolvers = mergeResolvers([listingsResolvers, profileResolvers, requestsResolvers]);

/**
 * Simple deep-merge for resolver objects.
 * Merges Query, Mutation, and any type-level resolvers from multiple sources.
 */
function mergeResolvers(resolverArray) {
    const merged = {};

    for (const resolverObj of resolverArray) {
        for (const [type, fields] of Object.entries(resolverObj)) {
            if (!merged[type]) {
                merged[type] = {};
            }
            Object.assign(merged[type], fields);
        }
    }

    return merged;
}
