import { body, oneOf, param } from "express-validator/check";
import { upload } from "./multer";
import { RequestHandler } from "express-serve-static-core";
import { validate } from './validationMiddleware'
import { getToken } from "./jwt";

//First we will define all the validations (we are using the oneOf because it returns a middleware function)

const loginValidation = oneOf([
    [body('username').exists().isString().withMessage('No username provided'),
    body('password').exists().isString().withMessage('No password provided')]
]);

const createUserValidation = oneOf([
    [body('username').exists().isString().withMessage('No username provided'),
    body('email', 'Invalid email').exists().isEmail().withMessage('no valid email provided'),
    body('password').exists().isString().withMessage('No password provided')
    ]
]);

const userExistsValidation = oneOf([
    [param('username').exists().isString().withMessage('No username provided')]
]);

const emailExistsValidation = oneOf([
    [param('email').exists().isString().withMessage('No email provided')]
]);



//Now we will define all the files and media middlewares

const getAvatar = upload.single('avatar');


//Finally we bootstrap all those middlewares 
//Note: put the file middlewares first

export const createUserMiddleware: RequestHandler[] = [createUserValidation, validate];
export const loginMiddleware: RequestHandler[] = [loginValidation, validate];
export const imageTest: RequestHandler[] = [getAvatar];
export const editUser: RequestHandler[] = [getToken, getAvatar];

