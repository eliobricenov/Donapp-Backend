import { Request, Response } from "express";
import { NextFunction } from "connect";
import { HttpException } from "../util/exceptions/HttpException";

export function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    const status = err.status || 500;
    const message = status != 500 ? err.message : 'Internal Server Error';
    const errors = err.errors.map(err => JSON.stringify(err)) || [];
    console.log(errors);
    res.status(status).json({ status, message, errors });
}