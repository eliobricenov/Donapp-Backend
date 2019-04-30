import { ProposalRepository } from "../repository/ProposalRepository";
import { types } from "../util/sql/queries";
import { Post } from "../model/Post";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { Proposal } from "../model/Proposal";

export class ProposalService {
    
    proposalRepository: ProposalRepository;

    constructor() {
        this.proposalRepository = new ProposalRepository();
    }

    async fetch(userId:string, size?: number, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            await this.findOne(lastItemId);
            posts = await this.proposalRepository.fetch(userId, size, lastItemId);
        } else {
            posts = await this.proposalRepository.fetch(userId, size);
        }
        return posts;
    }

    async findOne(id: string): Promise<any> {
        const post = await this.proposalRepository.findOne(id);
        if (!post) {
            throw new NotFoundException('proposal');
        } else {
            return post;
        }
    }

    async deleteProposal(id: string) {
        await this.findOne(id);
        await this.proposalRepository.deleteProposal(id);
    }


    async createProposal(userId: string, data: Proposal, images: Express.Multer.File[]) {
        const createdProposal = await this.proposalRepository.createProposal(userId, data, images);
        return createdProposal;
    }

    async createExchange(userId: string, data: Proposal, images: Express.Multer.File[]) {
        const createdProposal = await this.proposalRepository.createProposal(userId,  data, images);
        return createdProposal;
    }

    async rejectProposal(id: string) {
        await this.proposalRepository.rejectProposal(id);
    }
}
