import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { RequestService } from "../service/RequestService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";
import { ExchangeRequestRepository } from "../repository/ExchangeRequestRepository";

/**
 * User router that handles all request related to users
 * @todo 
 */
class ExchangeRequestRouter extends Router {

    exchangeService: RequestService<ExchangeRequestRepository>

    constructor() {
        super();
        this.exchangeService = new RequestService<ExchangeRequestRepository>(ExchangeRequestRepository);
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.fetch);
        this.router.get('/id/:id', this.findRequest);
        this.router.post('/', [getToken, upload.array('pictures')], this.createExchange);
        this.router.delete('/id/:id', this.deleteRequest);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { size, lastItem } = req.query;
            const requests = await this.exchangeService.fetch(size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    findRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const request = await this.exchangeService.findOne(id);
            res.json({ status: 200, data: request });
        } catch (error) {
            next(error);
        }

    }

    deleteRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.exchangeService.deleteRequest(id);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }

    
    createExchange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.exchangeService.createExchange(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }
}

export default new ExchangeRequestRouter().router;