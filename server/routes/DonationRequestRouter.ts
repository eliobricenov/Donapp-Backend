import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { RequestService } from "../service/RequestService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";
import { DonationRequestRepository } from "../repository/DonationRequestRepository";

/**
 * User router that handles all request related to users
 * @todo 
 */
class DonationRequestRouter extends Router {

    donationService: RequestService<DonationRequestRepository>

    constructor() {
        super();
        this.donationService = new RequestService<DonationRequestRepository>(DonationRequestRepository);
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.fetch);
        this.router.get('/id/:id', this.findRequest);
        this.router.post('/', [getToken, upload.array('pictures')], this.create);
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


    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.donationService.createDonation(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }

    }

}

export default new DonationRequestRouter().router;