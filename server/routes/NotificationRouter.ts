import { Request, Response, NextFunction } from "express";
import { DonationRequestRepository } from "../repository/DonationRequestRepository";
import { TradeRequestRepository } from "../repository/TradeRequestRepository";
import { RequestService } from "../service/RequestService";
import Router from "./Router";
import { NotificationService } from "../service/NotificationService";
import { getToken } from "../middlewares/jwt";
import { upload } from "../middlewares/multer";

/**
 * @todo 
 */
class NotificationRouter extends Router {

    notificationService: NotificationService;

    constructor() {
        super();
        this.notificationService = new NotificationService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', getToken, this.fetch);
        this.router.get('/id/:id', this.findOne);
        this.router.post('/', [getToken, upload.array('pictures')], this.createNotification);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { size, lastItem } = req.query;
            const requests = await this.notificationService.fetch(userId, size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    createNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.notificationService.createNotification(userId, req.body);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }

    findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { id } = req.params;
            const creeatedRequest = await this.notificationService.findOne(id);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }

}

export default new NotificationRouter().router;