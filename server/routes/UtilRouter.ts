import { Router } from "express";
import getStatesRoute from "../util/helper/getStates";

/**
 * @todo 
 */
class UtilRouter {

    router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/states', getStatesRoute);
    }

}

export default new UtilRouter().router;