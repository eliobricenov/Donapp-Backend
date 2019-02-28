import { body, oneOf, param } from "express-validator/check";
import { upload } from "./multer";
import { RequestHandler } from "express-serve-static-core";
import { validate } from './validationMiddleware'

//First we will define all the validations (we are using the oneOf because it returns a middleware function)

const loginValidation = oneOf([
    [body('username').exists().isString().withMessage('No username provided'),
    body('password').exists().isString().withMessage('No password provided')]
]);

const createUserValidation = oneOf([
    [body('username').exists().isString().withMessage('No username provided'),
    body('email', 'Invalid email').exists().isEmail().withMessage('no valid email provided'),
    // body('firstName').exists().isString().withMessage('No first name provided'),
    // body('lastName').exists().isString().withMessage('No last name provided'),
    body('password').exists().isString().withMessage('No password provided')
    // body('passwordConfirm')
    //     .exists().withMessage('No confirmation password provided')
    //     .custom((value, { req }) => {
    //         if (value !== req.body.password) {
    //             throw new Error("Passwords don't match");
    //         } else {
    //             return value;
    //         }
    //     })
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

const createUserMiddleware: RequestHandler[] = [getAvatar, createUserValidation, validate];
const loginMiddleware: RequestHandler[] = [loginValidation, validate];
const imageTest = [getAvatar];


export { createUserMiddleware, loginMiddleware, createUserValidation, userExistsValidation, emailExistsValidation, imageTest };