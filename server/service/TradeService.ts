import { v4 } from 'uuid';
import { TradeRepository } from "../repository/TradeRepository";
import pgp from "../util/db";
import { tradeQueries, requestQueries, proposalQueries } from "../util/sql/queries";
import { ProposalService } from './ProposalService';

export class TradeService {

    tradeRepository: TradeRepository;
    proposalService: ProposalService;

    constructor() {
        this.tradeRepository = new TradeRepository();
        this.proposalService = new ProposalService();
    }

    // async createTrade(proposalId: string) {
    //     await this.proposalService.findOne(proposalId);
    //     const userId = await this.tradeRepository.createTrade(proposalId);
    //     return userId;
    // }

    async getUnconfirmedTrades(userId: string) {
        const trades = await this.tradeRepository.getUnconfirmedTrades(userId);
        return trades;
    }

    // async confirmTrade(tradeId: string) {
    //     await this.tradeRepository.confirmTrade(tradeId);
    // }
}
