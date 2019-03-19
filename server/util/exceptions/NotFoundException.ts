import { HttpException } from "./HttpException";

export class NotFoundException extends HttpException {
    
    constructor(resource: string) {
        super(404, `No ${resource} with the provided information was not found`);
    }
}