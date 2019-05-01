import { RequestRepository } from "./RequestRepository";
import { types, tradeQueries, requestQueries, proposalQueries, notificationTypes, notificationQueries, donationQueries, ratingQueries } from "../util/sql/queries";
import pgp from "../util/db";
import { v4 } from 'uuid';
import { getNotificationMessage, getCurrentMoment } from "../util/helper/util";


export class TradeRepository extends RequestRepository {
    type: string = types.DONATION;

    async getUnconfirmedTrades(userId: string) {
        const trades = await pgp.tx(async tx => {
            const previews = await tx.manyOrNone(tradeQueries.getUnconfirmedTrades, { userId });
            for (const p of previews) {
                const { proposalId } = p;
                const { url } = await tx.one(proposalQueries.getProposalPreview, { proposalId });
                console.log(url);
                p.image = url;
            }
            return previews;

        })
        return trades;
    }


    async createTrade(proposalId: string) {
        const userId = await pgp.tx(async tx => {
            const id = v4();
            //sea
            const { id: requestId, userId } = await tx.one(requestQueries.getFromProposal, { proposalId })
            //get information of the proposal that was made
            const { proposalOwnerName, title, proposalOwner, requestOwner } = await tx.one(proposalQueries.getProposalPreview, { proposalId });
            //create trade
            await tx.none(tradeQueries.createTrade, { id, proposalId, userId });
            //mark request as done 
            await tx.none(requestQueries.markAsFinished, { requestId });
            //mark proposal as done
            await tx.none(proposalQueries.markAsFinished, { proposalId });
            //create trade rating for both users
            await tx.none(ratingQueries.createRating, { id, evaluatorId: requestOwner, evaluatedId: proposalOwner, rating: null });
            await tx.none(ratingQueries.createRating, { id, evaluatorId: proposalOwner, evaluatedId: requestOwner, rating: null });
            //create custom message for notification
            const notificationType = notificationTypes.RECEIVED;
            const message = getNotificationMessage(proposalOwnerName, title, notificationType, this.type);
            //save notification
            await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
            return userId;
        })
        return userId;
    }

    async rateTrade(userId: string, rate: number, tradeId: string) {
        await pgp.tx(async tx => {
            await tx.none(ratingQueries.updateRating, { userId, rate, tradeId });
            const { evaluatorName, requestName, evaluatedUser, proposalId } = await tx.one(tradeQueries.getTradePreview, { tradeId, userId });
            //create custom message for notification
            const notificationType = notificationTypes.RATED;
            const message = getNotificationMessage(evaluatorName, requestName, notificationType, this.type, rate);
            //save notification
            await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: evaluatedUser, notificationType, createdAt: getCurrentMoment() })
        })
    }


}
