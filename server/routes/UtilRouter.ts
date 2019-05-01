import getStatesRoute from "../util/helper/getStates";
import Router from "./Router";
import { RequestService } from "../service/RequestService";
import { DonationRequestRepository } from "../repository/DonationRequestRepository";
import { TradeRequestRepository } from "../repository/TradeRequestRepository";
import { Request, Response } from "express";

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
        this.router.post('/test', this.test)
    }

    test(req: Request, res: Response) {
        res.sendStatus(200);
    }

}

export default new UtilRouter().router;