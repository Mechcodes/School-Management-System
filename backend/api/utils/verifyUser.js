// import { errorHandler } from "./error.js";
// import  jwt  from "jsonwebtoken";
// export const verifyToken=(req,res,next)=>{
//     const token = req.cookies.access_token;
//     if(!token) return next(errorHandler(401,'Unauthorized'));

//     jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
//         if(err) return next(errorHandler(403,'Forbidden'));

//         req.user=user;
//         next();
//     })

// }

import jwt from 'jsonwebtoken';
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
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
        console.log(req.user.role);
        if (!allowedRoles.includes(req.user.role)) {
            return next(errorHandler(403, 'Access Denied'));
        }
        next();
    };
};
