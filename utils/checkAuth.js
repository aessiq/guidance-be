import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
    try {
        const decoded = jwt.decode(token, 'secret123');
        req.userId = decoded._id;
        next();
    } catch (e) {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}