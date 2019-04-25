import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { RequestService } from "../service/RequestService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";
import { DonationRepository } from "../repository/DonationRepository";

/**
 * User router that handles all request related to users
 * @todo 
 */
class DonationRouter extends Router {

    donationService: RequestService<DonationRepository>

    constructor() {
        super();
        this.donationService = new RequestService<DonationRepository>(DonationRepository);
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.fetch);
        this.router.get('/id/:id', this.findRequest);
        this.router.post('/donation', [getToken, upload.array('pictures')], this.createDonation);
        this.router.post('/exchange', [getToken, upload.array('pictures')], this.createExchange);
        this.router.post('/accept', getToken, this.acceptRequest);
        this.router.delete('/id/:id', this.deleteRequest);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { size, lastItem } = req.query;
            const requests = await this.donationService.fetch(size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    findRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const request = await this.donationService.findOne(id);
            res.json({ status: 200, data: request });
        } catch (error) {
            next(error);
        }

    }

    deleteRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.donationService.deleteRequest(id);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }

    
    createExchange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.donationService.createExchange(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }

    createDonation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.donationService.createDonation(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
        
    }

    acceptRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { requestId } = req.body;
            await this.donationService.acceptRequest(requestId);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }
}

export default new DonationRouter().router;