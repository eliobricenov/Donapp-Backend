import getStatesRoute from "../util/helper/getStates";
import Router from "./Router";

/**
 * @todo 
 */
class UtilRouter extends Router {


    constructor() {
        super();
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