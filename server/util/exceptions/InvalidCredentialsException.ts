import { HttpException } from "./HttpException";

export class InvalidCredentialsException extends HttpException {
    
    constructor() {
        super(403, 'Provided user credentials are not valid');
    }
}