import { HttpException } from "./HttpException";

export class TokenNotValidException extends HttpException {
    
    constructor() {
        super(403, 'Provided Token is not valid');
    }
}