
import jwt from 'jsonwebtoken';
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));
        // console.log(user);
        req.user = user;
        
        next();
    });
};

export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // console.log(req.user.role);
        if (!allowedRoles.includes(req.user.role)) {
            return next(errorHandler(403, 'Access Denied'));
        }
        next();
    };
};
