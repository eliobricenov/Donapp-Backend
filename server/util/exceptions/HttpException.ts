
export class HttpException extends Error {

    public status: number;
    public message: string;
    public errors: Error[];

    constructor(status: number, message: string, errors?: Error[]) {
        super(message);
        this.errors = errors || [];
        this.status = status;
        this.message = message;
    }

}