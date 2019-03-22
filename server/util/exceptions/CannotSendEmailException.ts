import { HttpException } from "./HttpException";

export class CannotSendEmailException extends HttpException {
    
    constructor(email: string) {
        super(500, `Email to ${email} could not be sent`);
    }
}