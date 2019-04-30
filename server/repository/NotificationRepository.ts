import { v4 } from 'uuid';
import { Post } from "../model/Post";
import pgp from "../util/db";
import { getCurrentMoment } from "../util/helper/util";
import { notificationQueries, postQueries, proposalQueries } from "../util/sql/queries";
import { Notification, notificationsTypes } from '../model/Notification';


/***
 * @todo CREATE CLASS FOR DONATIONS AND EXCHANGES
 */
export class NotificationRepository {


    async fetch(userId: string, size: number = 4, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            posts = await pgp.manyOrNone(notificationQueries.fetchWithLimit, { userId, size, id: lastItemId }) || [];
        } else {
            posts = await pgp.manyOrNone(notificationQueries.fetch, { userId, size }) || [];
        }
        for (const post of posts) {
            await this.getNotificationPreview(post)
        }
        return posts;
    }

    async findOne(id: string) {
        const notification = await pgp.oneOrNone(notificationQueries.findOne, { id, });
        return notification;
    }

    async createNotification(userId: string, data: Notification) {
        const createdNotification = await pgp.tx(async tx => {
            const { message, proposalId } = data;
            const notificationId = v4();
            const createdAt = getCurrentMoment();
            await tx.none(notificationQueries.createNotification, { id: notificationId, userId, message, proposalId, createdAt });
            return { id: notificationId, userId, message, proposalId };
        });
        return createdNotification;
    }

    async deleteNotification(id: string) {
        await pgp.none(notificationQueries.deleteNotification, { id });
    }

    async getNotificationPreview(notification: Notification) {
        const preview = notification.proposalId ? await pgp.one(proposalQueries.getProposalPreview, { proposalId: notification.proposalId }) : [];
        notification.preview = preview;
    }



}