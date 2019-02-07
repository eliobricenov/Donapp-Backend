import { Request, Response } from "express";
import { NextFunction } from "connect";

const findToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader != 'undefined') {
        const bearerToken = bearerHeader.split(' ');
        req.params['token'] = bearerToken[1];
        next();
    } else {
        throw {
            status: 403,
            errors: [{
                message: 'No token provided'
            }]
        }
    }
};