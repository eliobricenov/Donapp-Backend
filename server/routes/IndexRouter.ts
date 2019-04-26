import { Response } from "express";
import UserRouter from "./UserRouter";
import UtilRouter from "./UtilRouter";
import Router from "./Router";
import ExchangeRouter from "./ExchangeRequestRouter";
import DonationRouter from "./DonationRequestRouter";
// import RequestRouter from "./RequestRouter";

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
        this.router.use('/request/donation', DonationRouter);
        this.router.use('/request/exchange', ExchangeRouter);
        // this.router.use('/post', PostRouter);
    }


}


export default new IndexRouter().router;