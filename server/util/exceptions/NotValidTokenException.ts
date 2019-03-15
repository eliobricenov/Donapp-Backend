import { HttpException } from "./HttpException";

export class NotValidTokenException extends HttpException {
    
    constructor(token: string, refresh?: boolean) {
        super(403, 'Provided Token is not valid');
        // console.log(`The following ${ refresh ? 'refresh': ''} token is not valid: ${token}`)
    }
}