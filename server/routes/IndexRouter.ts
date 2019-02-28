import { Router, Request, Response } from "express";
import UserRouter from "./UserRouter";

const router = Router();

router.post('/', (req: Request, res: Response) => {
    console.log(req.sessionID);
    res.sendStatus(200);
});

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
        this.router.use('/prueba-session', router);
        this.router.use('/user', UserRouter);
    }


}


export default new IndexRouter().router;