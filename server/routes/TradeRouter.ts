import { Response, NextFunction, Request } from "express";
import { upload } from "../middlewares/multer";
import { TradeService } from "../service/TradeService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";

/**
 * User router that handles all trade related to users
 * @todo 
 */
class Trade extends Router {

    tradeService: TradeService

    constructor() {
        super();
        this.tradeService = new TradeService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.post('/', [getToken], this.create);
        this.router.get('/unconfirmed', getToken, this.getUnconfirmedTrades);
        this.router.post('/rate', getToken, this.rateTrade);
    }   


    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { proposalId } = req.body;
            const response = await this.tradeService.createTrade(proposalId);
            res.json({ status: 200, userId: response});
        } catch (error) {
            next(error)
        }

    }

    getUnconfirmedTrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const requests = await this.tradeService.getUnconfirmedTrades(userId);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    rateTrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { tradeId, rate  } = req.body;
            const requests = await this.tradeService.rateTrade(userId, rate, tradeId);
            res.json({ status: 200 });
        } catch (error) {
            next(error);
        }

    }

}

export default new Trade().router;