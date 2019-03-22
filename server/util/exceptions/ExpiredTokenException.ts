import { HttpException } from "./HttpException";

export class ExpiredTokenException extends HttpException {
    
    constructor(token: string) {
        super(403, `Following token is expired: ${token}`);
    }
}