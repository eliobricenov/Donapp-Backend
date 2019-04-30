import { RequestRepository } from "./RequestRepository";
import { types, donationQueries, requestQueries, proposalQueries, notificationTypes, notificationQueries } from "../util/sql/queries";
import pgp from "../util/db";
import { v4 } from 'uuid';
import { getNotificationMessage, getCurrentMoment } from "../util/helper/util";


export class DonationRepository extends RequestRepository {
    type: string = types.DONATION;

    async getUnconfirmedDonations(userId: string, size?: number, lastItemId?: string) {
        const donations = await pgp.tx(async tx => {
            let donations = [];
            if (lastItemId) {
                donations = await pgp.manyOrNone(donationQueries.getUnconfirmedDonationsWithLimit, { userId, size, id: lastItemId }) || [];
            } else {
                donations = await pgp.manyOrNone(donationQueries.getUnconfirmedDonations, { userId, size }) || [];
            }
            for (const donation of donations) {
                await this.getPreview(donation)
            }
            return donations;

        })
        return donations;
    }

    async createDonation(proposalId: string) {
        const userId = await pgp.tx(async tx => {
            const id = v4();
            //sea
            const { id: requestId, userId } = await tx.one(requestQueries.getFromProposal, { proposalId })
            //get information of the proposal that was made
            const { proposalOwnerName, title, proposalOwner } = await tx.one(proposalQueries.getProposalPreview, { proposalId });
            //create donation
            await tx.none(donationQueries.createDonation, { id, proposalId, userId });
            //mark request as done 
            await tx.none(requestQueries.markAsFinished, { requestId });
            //mark proposal as done
            await tx.none(proposalQueries.markAsFinished, { proposalId });
            //create custom message for notification
            const notificationType = notificationTypes.PROPOSAL_ACCEPTED;
            const message = getNotificationMessage(proposalOwnerName, title, notificationType);
            //save notification
            await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
            return userId;
        })
        return userId;
    }

    async confirmDonation(donationId: string) {
        await pgp.tx(async tx => {
            const { requestOwnerName, title, proposalOwner, proposalId } = await tx.one(donationQueries.getDonationPreview, { donationId });
            //create custom message for notification
            const notificationType = notificationTypes.DONATION_CONFIRMED;
            const message = getNotificationMessage(requestOwnerName, title, notificationType);
            //save notification
            await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
            await pgp.none(donationQueries.markAsConfirmed, { donationId });
        })
    }


    async getPreview(donation: any) {
        const preview = await pgp.oneOrNone(proposalQueries.getProposalPreview, { proposalId: donation.proposalId }) || [];
        donation.preview = preview;
    }


}
