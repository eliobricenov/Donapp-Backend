import { HttpException } from "./HttpException";

export class UserNotFoundException extends HttpException {
    
    constructor() {
        super(404, 'No user with the provided information was not found');
    }
}