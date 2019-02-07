import express = require('express');
import * as bodyParser from 'body-parser';
import IndexRouter from './routes/IndexRouter';
import { errorMiddleware } from './middlewares/errorMiddleware';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setUpMiddlewares();
        this.setUpRoutes();
        this.setUpErrorMiddlewares();
    }

    private setUpMiddlewares(): void {
        // support application/json
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private setUpRoutes(): void {
        this.app.use('/', IndexRouter);
    }

    private setUpErrorMiddlewares(): void {
        this.app.use(errorMiddleware);
    }
}

export default new Server().app;