import { Request, Response } from "express";
import { NextFunction } from "connect";
import { JwtTokenService } from "../service/JwtTokenService";
import { HttpException } from "../util/exceptions/HttpException";
import { NotValidTokenException } from "../util/exceptions/NotValidTokenException";

export const getToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string> req.headers['x-access-token'];
    const refreshToken = <string>req.headers['x-refresh-token'];
    if (typeof token != 'undefined' && typeof refreshToken != 'undefined') {
        try {
            const { data } = await JwtTokenService.decode(token);
            req.userID = data.id;
            next();
        } catch (error) {
            // if (error instanceof ExpiredTokenException) {
            //     try {
            //         console.log('Generating new access token through the refresh token');
            //         const newToken = await JwtTokenService.refreshToken(token, refreshToken);
            //         req.token = newToken;
            //     } catch (error) {
            //         throw(new NotValidTokenException(refreshToken, true));
            //     }
            // } else {
            //     throw error;
            // }
            try {
                console.log('Generating new access token through the refresh token');
                const newToken = await JwtTokenService.refreshToken(token, refreshToken);
                const { data } = await JwtTokenService.decode(newToken);
                req.userID = data.id;
                next();
            } catch (error) {
                next(new NotValidTokenException(refreshToken, true));
            }
        }
    } else {
         next(new HttpException(403, 'No tokens provided'));
    }
};

