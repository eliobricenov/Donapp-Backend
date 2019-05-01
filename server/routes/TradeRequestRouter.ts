import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { RequestService } from "../service/RequestService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";
import { TradeRequestRepository as TradeRequestRepository } from "../repository/TradeRequestRepository";

/**
 * User router that handles all request related to users
 * @todo 
 */
class TradeRequestRouter extends Router {

    tradeService: RequestService<TradeRequestRepository>

    constructor() {
        super();
        this.tradeService = new RequestService<TradeRequestRepository>(TradeRequestRepository);
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.fetch);
        this.router.get('/id/:id', this.findRequest);
        this.router.post('/', [getToken, upload.array('pictures')], this.createTrade);
        this.router.delete('/id/:id', this.deleteRequest);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { size, lastItem } = req.query;
            const requests = await this.tradeService.fetch(size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    findRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const request = await this.tradeService.findOne(id);
            res.json({ status: 200, data: request });
        } catch (error) {
            next(error);
        }

    }

    deleteRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.tradeService.deleteRequest(id);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }

    
    createTrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.tradeService.createTrade(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }
}

export default new TradeRequestRouter().router;