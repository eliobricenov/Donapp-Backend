import getStatesRoute from "../util/helper/getStates";
import Router from "./Router";
import { RequestService } from "../service/RequestService";
import { DonationRequestRepository } from "../repository/DonationRequestRepository";
import { ExchangeRequestRepository } from "../repository/ExchangeRequestRepository";
import { Request, Response } from "express";
import { Awesome, A, B } from "../util/helper/util";

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
        const x = new RequestService<DonationRequestRepository>(DonationRequestRepository);
        const y = new RequestService<ExchangeRequestRepository>(ExchangeRequestRepository)
        x.test();
        y.test();
        // const a = new Awesome<A>(A);
        // const b = new Awesome<B>(B);
        // a.test();
        // b.test();
        res.sendStatus(200);
    }

}

export default new UtilRouter().router;