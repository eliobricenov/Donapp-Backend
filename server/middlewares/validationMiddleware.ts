import { ValidationChain, validationResult } from "express-validator/check";

import { Request } from "express-serve-static-core";
import { Response } from "express";
import { NextFunction } from "connect";


/**
 * Middleware that validates the request and checks if there are errors 
 */
export function validate(req: Request, res: Response, next: NextFunction): void {
    const validationErrors = validationResult(req).formatWith(errorFormater);

    if (!validationErrors.isEmpty()) {
        //if there are errors pass it ot the next middleware
        next({
            status: 400,
            message: 'Invalid Request',
            errors: validationErrors.array({ onlyFirstError: true })
        });
    } else {
        //if not pass no data
        next();
    }
}

/**
 * Function that extracts the nested errors from the raw object provided by the validation library
 * @param data raw data
 */
const errorFormater = (data: any): [] => {
    const { nestedErrors } = data;
    return nestedErrors;
}