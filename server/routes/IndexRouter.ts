import { Router } from "express";
import UserRouter from "./UserRouter";

/**
 * User router that handles all request related to users
 * @todo delete getAll() endpoint once it is not used anymore, it is not safe
 */
class IndexRouter {

    router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.use('/user', UserRouter);
    }
}


export default new IndexRouter().router;