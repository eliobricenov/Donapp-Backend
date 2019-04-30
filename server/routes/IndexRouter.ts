import { Response } from "express";
import UserRouter from "./UserRouter";
import UtilRouter from "./UtilRouter";
import Router from "./Router";
import ExchangeRequestRouter from "./ExchangeRequestRouter";
import DonationRequestRouter from "./DonationRequestRouter";
import ProposalRouter from "./ProposalRouter";
import NotificationRouter from "./NotificationRouter";
import DonationRouter from "./DonationRouter";
import TradeRouter from "./TradeRouter";
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
        this.router.use('/request/donation', DonationRequestRouter);
        this.router.use('/request/exchange', ExchangeRequestRouter);
        this.router.use('/proposal', ProposalRouter);
        this.router.use('/donation', DonationRouter);
        this.router.use('/notification', NotificationRouter);
        this.router.use('/trade', TradeRouter);
        // this.router.use('/post', PostRouter);
    }


}


export default new IndexRouter().router;