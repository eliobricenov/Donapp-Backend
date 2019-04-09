import { Response } from "express";
import UserRouter from "./UserRouter";
import PostRouter from "./PostRouter";
import UtilRouter from "./UtilRouter";
import Router from "./Router";

class IndexRouter extends Router {

    constructor() {
        super();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.use('/', UtilRouter);
        this.router.use('/user', UserRouter);
        this.router.use('/post', PostRouter);
    }


}


export default new IndexRouter().router;