import { Request, Response, NextFunction } from "express";
import { DonationRequestRepository } from "../repository/DonationRequestRepository";
import { ExchangeRequestRepository } from "../repository/ExchangeRequestRepository";
import { RequestService } from "../service/RequestService";
import Router from "./Router";
import { ProposalService } from "../service/ProposalService";
import { getToken } from "../middlewares/jwt";
import { upload } from "../middlewares/multer";

/**
 * @todo 
 */
class ProposalRouter extends Router {

    proposalService: ProposalService;

    constructor() {
        super();
        this.proposalService = new ProposalService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', getToken, this.fetch);
        this.router.get('/id/:id', this.findOne);
        this.router.post('/reject/', getToken, this.rejectProposal);
        this.router.post('/', [getToken, upload.array('pictures')], this.createProposal);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { size, lastItem } = req.query;
            const requests = await this.proposalService.fetch(userId, size, lastItem);
            res.json({ status: 200, data: requests });
        } catch (error) {
            next(error);
        }

    }

    createProposal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const creeatedRequest = await this.proposalService.createProposal(userId, req.body, files);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }

    findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { id } = req.params;
            const creeatedRequest = await this.proposalService.findOne(id);
            res.json({ status: 200, data: creeatedRequest });
        } catch (error) {
            next(error)
        }
    }

    rejectProposal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const { proposalId } = req.body;
            const creeatedRequest = await this.proposalService.rejectProposal(proposalId);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }

}

export default new ProposalRouter().router;