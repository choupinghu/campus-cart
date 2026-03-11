import { auth } from '../auth.js';
import { fromNodeHeaders } from 'better-auth/node';

/**
 * Express middleware that verifies the better-auth session cookie.
 * On success, attaches `req.user` with the authenticated user object.
 * On failure, responds with 401 Unauthorized.
 */
export async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
            return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
        }

        req.user = session.user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    }
}
