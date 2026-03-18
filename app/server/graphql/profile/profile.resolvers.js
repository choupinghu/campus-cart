import { GraphQLError } from 'graphql';
import { prisma } from '../../prisma.js';
import { requireAuth } from '../auth.js';

function validatePhone(phone) {
    if (typeof phone !== 'string') {
        throw new GraphQLError('Invalid phone number format.', {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    const trimmed = phone.trim();
    // Allow clearing phone with empty string
    if (trimmed === '') {
        return '';
    }
    // Basic length check
    if (trimmed.length > 20) {
        throw new GraphQLError('Phone number is too long.', {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    // Allow digits, spaces, dashes, parentheses, and leading plus sign
    const phoneRegex = /^[+0-9().\-\s]+$/;
    if (!phoneRegex.test(trimmed)) {
        throw new GraphQLError('Phone number contains invalid characters.', {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    const digitCount = trimmed.replace(/\D/g, '').length;
    if (digitCount < 7) {
        throw new GraphQLError('Phone number is too short.', {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    return trimmed;
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
            
            if (input.phone !== undefined) {
                if (input.phone === null) {
                    // Explicitly clear phone
                    updateData.phone = null;
                } else {
                    const validatedPhone = validatePhone(input.phone);
                    // Treat empty string (after trim) as clearing the phone
                    updateData.phone = validatedPhone === '' ? null : validatedPhone;
                }
            }

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
