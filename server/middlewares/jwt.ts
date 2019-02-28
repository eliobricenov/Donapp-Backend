import { Request, Response } from "express";
import { NextFunction } from "connect";
import { JwtTokenService } from "../service/JwtTokenService";
import { HttpException } from "../util/exceptions/HttpException";

export const getToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string> req.headers['x-access-token'];
    const refreshToken = <string> req.headers['x-refresh-token'];
    if (typeof token != 'undefined' && typeof refreshToken != 'undefined') {
        try {
            await JwtTokenService.decode(token);
            req.token = token;
        } catch (error) {
            const newToken = await JwtTokenService.refreshToken(token, refreshToken);
            req.token = newToken;
        }
    } else {
        throw new HttpException(403, 'No tokens provided')
    }
    next();
};

