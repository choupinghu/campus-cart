import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma.js';

function requireAuth(context) {
    if (!context.user) {
        throw new GraphQLError('You must be signed in.', {
            extensions: { code: 'UNAUTHENTICATED' },
        });
    }
    return context.user;
}

export const profileResolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            const user = requireAuth(context);

            const profile = await prisma.user.findUnique({
                where: { id: user.id },
                include: {
                    _count: { select: { listings: true } },
                },
            });

            if (!profile) {
                throw new GraphQLError('User not found', {
                    extensions: { code: 'NOT_FOUND' },
                });
            }

            return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                image: profile.image,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                createdAt: profile.createdAt.toISOString(),
                listingCount: profile._count.listings,
            };
        },
    },

    Mutation: {
        updateProfile: async (_parent, { input }, context) => {
            const user = requireAuth(context);

            const updateData = {};
            if (input.name !== undefined && input.name !== null) updateData.name = input.name;
            if (input.bio !== undefined) updateData.bio = input.bio;
            if (input.phone !== undefined) updateData.phone = input.phone;
            if (input.location !== undefined) updateData.location = input.location;
            if (input.image !== undefined) updateData.image = input.image;

            const updated = await prisma.user.update({
                where: { id: user.id },
                data: updateData,
                include: {
                    _count: { select: { listings: true } },
                },
            });

            return {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                image: updated.image,
                bio: updated.bio,
                phone: updated.phone,
                location: updated.location,
                createdAt: updated.createdAt.toISOString(),
                listingCount: updated._count.listings,
            };
        },
    },
};
