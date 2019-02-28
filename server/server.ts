import * as bodyParser from 'body-parser';
import cors from 'cors';import express from 'express';
import { errorMiddleware } from './middlewares/errorMiddleware';
import IndexRouter from './routes/IndexRouter';


class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setUpMiddlewares();
        this.setUpRoutes();
        this.setUpErrorMiddlewares();
    }

    private setUpMiddlewares(): void {
        this.app.use(cors({credentials: true, origin: `http://192.168.1.${7}:8100` || 'http://localhost:8100'}));
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