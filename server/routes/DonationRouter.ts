import { Response, NextFunction, Request } from "express";
import { upload } from "../middlewares/multer";
import { DonationService } from "../service/DonationService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";

/**
 * User router that handles all donation related to users
 * @todo 
 */
class Donation extends Router {

    donationService: DonationService

    constructor() {
        super();
        this.donationService = new DonationService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        // this.router.get('/', this.fetch);
        // this.router.get('/id/:id', this.findDonation);
        // this.router.post('/', [getToken, upload.array('pictures')], this.create);
        // this.router.delete('/id/:id', this.deleteDonation);
        this.router.post('/', getToken, this.create);
        this.router.get('/unconfirmed', getToken, this.getUnconfirmedDonations);
        this.router.post('/confirm', getToken, this.confirmDonation);
    }   

    // fetch = async (req: Donation, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { size, lastItem } = req.query;
    //         const donations = await this.donationService.fetch(size, lastItem);
    //         res.json({ status: 200, data: donations });
    //     } catch (error) {
    //         next(error);
    //     }

    // }

    // findDonation = async (req: Donation, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { id } = req.params;
    //         const donation = await this.donationService.findOne(id);
    //         res.json({ status: 200, data: donation });
    //     } catch (error) {
    //         next(error);
    //     }

    // }

    // deleteDonation = async (req: Donation, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const { id } = req.params;
    //         await this.donationService.deleteDonation(id);
    //         res.json({ status: 200 });
    //     } catch (error) {
    //         next(error)
    //     }
    // }


    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { proposalId } = req.body;
            const response = await this.donationService.createDonation(proposalId);
            res.json({ status: 200, userId: response});
        } catch (error) {
            next(error)
        }

    }

    getUnconfirmedDonations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { size, lastItem } = req.query;
            const requests = await this.donationService.getUnconfirmedDonations(userId, size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    confirmDonation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { donationId  } = req.body;
            const requests = await this.donationService.confirmDonation(donationId);
            res.json({ status: 200 });
        } catch (error) {
            next(error);
        }

    }

}

export default new Donation().router;