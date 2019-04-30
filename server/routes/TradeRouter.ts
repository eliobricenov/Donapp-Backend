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
        // this.router.get('/', this.fetch);
        // this.router.get('/id/:id', this.findTrade);
        // this.router.post('/', [getToken, upload.array('pictures')], this.create);
        // this.router.delete('/id/:id', this.deleteTrade);
        // this.router.post('/', getToken, this.create);
        this.router.get('/unconfirmed', getToken, this.getUnconfirmedTrades);
        // this.router.post('/confirm', getToken, this.confirmTrade);
    }   

    // fetch = async (req: Trade, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { size, lastItem } = req.query;
    //         const trades = await this.tradeService.fetch(size, lastItem);
    //         res.json({ status: 200, data: trades });
    //     } catch (error) {
    //         next(error);
    //     }

    // }

    // findTrade = async (req: Trade, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { id } = req.params;
    //         const trade = await this.tradeService.findOne(id);
    //         res.json({ status: 200, data: trade });
    //     } catch (error) {
    //         next(error);
    //     }

    // }

    // deleteTrade = async (req: Trade, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { id } = req.params;
    //         await this.tradeService.deleteTrade(id);
    //         res.json({ status: 200 });
    //     } catch (error) {
    //         next(error)
    //     }
    // }


    // create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { proposalId } = req.body;
    //         const response = await this.tradeService.createTrade(proposalId);
    //         res.json({ status: 200, userId: response});
    //     } catch (error) {
    //         next(error)
    //     }

    // }

    getUnconfirmedTrades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const requests = await this.tradeService.getUnconfirmedTrades(userId);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    // confirmTrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const userId = req.userID!;
    //         const { tradeId  } = req.body;
    //         const requests = await this.tradeService.confirmTrade(tradeId);
    //         res.json({ status: 200 });
    //     } catch (error) {
    //         next(error);
    //     }

    // }

}

export default new Trade().router;