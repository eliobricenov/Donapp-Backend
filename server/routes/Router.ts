import Express from 'express';

export default abstract class Router {
    
    router: Express.Router;

    constructor() {
        this.router = Express.Router();   
    }

    abstract config(): void;
}