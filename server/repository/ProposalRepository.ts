import { v4 } from 'uuid';
import { Post } from "../model/Post";
import pgp from "../util/db";
import { getCurrentMoment, getNotificationMessage } from "../util/helper/util";
import { proposalQueries, postQueries, notificationQueries, notificationTypes } from "../util/sql/queries";
import { Proposal } from '../model/Proposal';
import { notificationsTypes } from '../model/Notification';


/***
 * @todo CREATE CLASS FOR DONATIONS AND EXCHANGES
 */
export class ProposalRepository {


    async fetch(userId: string, size: number = 4, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            posts = await pgp.manyOrNone(proposalQueries.fetchWithLimit, { userId, size, id: lastItemId }) || [];
        } else {
            posts = await pgp.manyOrNone(proposalQueries.fetch, { userId, size }) || [];
        }
        for (const post of posts) {
            await this.getPostPreview(post)
        }
        return posts;
    }

    async findOne(id: string) {
        const proposal = await pgp.oneOrNone(proposalQueries.findOne, { id, });
        await this.setPostImage(proposal);
        return proposal;
    }

    async createProposal(userId: string, data: Proposal, images: Express.Multer.File[]) {
        //create proposal
        const createdProposal = await pgp.tx(async tx => {
            const { description, requestId } = data;
            const proposalId = v4();
            const createdAt = getCurrentMoment();
            await tx.none(proposalQueries.createProposal, { id: proposalId, userId, description, requestId });
            const _images = await Promise.all(images.map(async image => {
                const imageId = v4();
                const { path, filename } = image;
                const url = `uploads/${filename}`;
                const createdAt = getCurrentMoment();
                await tx.none(proposalQueries.createProposalImage, { id: imageId, proposalId, path, createdAt, url });
                return { imageId, url, filename }
            }));
            //get information of the proposal that was made
            const { requestOwnerName, title, requestOwner, requestType} = await tx.one(proposalQueries.getProposalPreview, { proposalId });
            //create custom message for notification
            const notificationType = notificationTypes.RECEIVED;
            notificationsTypes
            const message = getNotificationMessage(requestOwnerName, title, notificationType, requestType);
            //save notification
            await await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: requestOwner, notificationType, createdAt: getCurrentMoment() })
            return { id: proposalId, userId, description, createdAt, images: _images, type: requestType };
        });
        return createdProposal;
    }

    async rejectProposal(proposalId: string) {
        await pgp.tx(async tx => {
            //get information of the proposal that was made
            const { proposalOwnerName, title, proposalOwner, requestType } = await tx.one(proposalQueries.getProposalPreview, { proposalId });
            const notificationType = notificationTypes.REJECTED;
            //create custom message for notification
            const message = getNotificationMessage(proposalOwnerName, title, notificationType, requestType);
            //save notification
            await tx.none(notificationQueries.createNotification, { id: v4(), proposalId, message, userId: proposalOwner, notificationType, createdAt: getCurrentMoment() })
            //mark proposal as finished
            await tx.none(proposalQueries.markAsFinished, { proposalId })
        })
    }

    async deleteProposal(id: string) {
        await pgp.none(proposalQueries.deleteProposal, { id });
    }

    async getPostPreview(proposal: Proposal) {
        const preview = await pgp.one(proposalQueries.getProposalPreview, { proposalId: proposal.id });
        proposal.preview = preview;
    }

    async setPostImage(proposal: Proposal) {
        const images = await pgp.manyOrNone(proposalQueries.getImagesFromProposal, { proposalId: proposal.id }) || [];
        proposal.images = images;
    }



}