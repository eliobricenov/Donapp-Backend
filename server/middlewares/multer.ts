// import * as multer from "multer";

import multer = require('multer');
import { Request } from "express";
import { HttpException } from '../util/exceptions/HttpException';

// Root path for file uploads
const UPLOAD_PATH = '../public/uploads/';


// Middleware that filters file upload
const imageAndMediaFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4)$/)) {
        return cb(new HttpException(400, 'Only images and media files are allowed'));
    }
    cb(null, true);
}

const fileNameFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, file.fieldname + '-' + Date.now())
}

const diskStorage = multer.diskStorage({destination: UPLOAD_PATH,  filename: fileNameFilter})

// Setting up multer 
const upload = multer({ storage: diskStorage, fileFilter: imageAndMediaFilter })

export { upload };
