import { Response } from "express";
import UserRouter from "./UserRouter";
import PostRouter from "./PostRouter";
import UtilRouter from "./UtilRouter";
import Router from "./Router";
import { DonationRepository } from "../repository/DonationRepository";
import ExchangeRouter from "./ExchangeRouter";
import DonationRouter from "./DonationRouter";
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
        this.router.use('/donation', DonationRouter);
        this.router.use('/exchange', ExchangeRouter);
        // this.router.use('/post', PostRouter);
    }


}


export default new IndexRouter().router;