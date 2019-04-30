import { v4 } from 'uuid';
import { DonationRepository } from "../repository/DonationRepository";
import pgp from "../util/db";
import { donationQueries, requestQueries, proposalQueries } from "../util/sql/queries";
import { ProposalService } from './ProposalService';

export class DonationService {

    donationRepository: DonationRepository;
    proposalService: ProposalService;

    constructor() {
        this.donationRepository = new DonationRepository();
        this.proposalService = new ProposalService();
    }

    async createDonation(proposalId: string) {
        await this.proposalService.findOne(proposalId);
        const userId = await this.donationRepository.createDonation(proposalId);
        return userId;
    }

    async getUnconfirmedDonations(userId: string, size?: number, lastItemId?: string) {
        let donations = [];
        if (lastItemId) {
            donations = await this.donationRepository.getUnconfirmedDonations(userId, size, lastItemId);
        } else {
            donations = await this.donationRepository.getUnconfirmedDonations(userId, size);
        }
        return donations;
    }

    async confirmDonation(donationId: string) {
        await this.donationRepository.confirmDonation(donationId);
    }
}
