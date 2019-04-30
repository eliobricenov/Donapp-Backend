import { RequestRepository } from "./RequestRepository";
import { types, tradeQueries, requestQueries, proposalQueries, notificationTypes, notificationQueries, donationQueries } from "../util/sql/queries";
import pgp from "../util/db";
import { v4 } from 'uuid';
import { getNotificationMessage, getCurrentMoment } from "../util/helper/util";


export class TradeRepository extends RequestRepository {
    type: string = types.DONATION;

    async getUnconfirmedTrades(userId: string) {
        const trades = await pgp.tx(async tx => {
            const previews = await tx.manyOrNone(tradeQueries.getUnconfirmedTrades, { userId });
            console.log(previews);
            for (const p of previews) {
                const { donationId } = p;
                const { image } = await tx.one(proposalQueries.getProposalPreview, { donationId });
                p.image = image;
            }
            return previews;

        })
        return trades;
    }

    // async createTrade(proposalId: string) {
    //     const userId = await pgp.tx(async tx => {
    //         const id = v4();
    //         //sea
    //         const { id: requestId, userId } = await tx.one(requestQueries.getFromProposal, { proposalId })
    //         //get information of the proposal that was made
    //         const { proposalOwnerName, title, proposalOwner } = await tx.one(proposalQueries.getProposalPreview, { proposalId });
    //         //create trade
    //         await tx.none(tradeQueries.createTrade, { id, proposalId, userId });
    //         //mark request as done 
    //         await tx.none(requestQueries.markAsFinished, { requestId });
    //         //mark proposal as done
    //         await tx.none(proposalQueries.markAsFinished, { proposalId });
    //         //create custom message for notification
    //         const notificationType = notificationTypes.PROPOSAL_ACCEPTED;
    //         const message = getNotificationMessage(proposalOwnerName, title, notificationType);
    //         //save notification
    //         await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
    //         return userId;
    //     })
    //     return userId;
    // }

    // async confirmTrade(tradeId: string) {
    //     await pgp.tx(async tx => {
    //         const { requestOwnerName, title, proposalOwner, proposalId } = await tx.one(tradeQueries.getTradePreview, { tradeId });
    //         //create custom message for notification
    //         const notificationType = notificationTypes.DONATION_CONFIRMED;
    //         const message = getNotificationMessage(requestOwnerName, title, notificationType);
    //         //save notification
    //         await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
    //     })
    // }


    // async getPreview(trade: any) {
    //     const preview = await pgp.oneOrNone(proposalQueries.getProposalPreview, { proposalId: trade.proposalId }) || [];
    //     trade.preview = preview;
    // }


}
