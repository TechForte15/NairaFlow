export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
            data: null
        });
    }

    // TODO: replace with real JWT verification once Team A's auth exists
    req.user = { id: 'user-1' }; // stubbed so you can build/test independently


    next();
}
