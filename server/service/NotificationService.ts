import { NotificationRepository } from "../repository/NotificationRepository";
import { types } from "../util/sql/queries";
import { Post } from "../model/Post";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { Notification } from "../model/Notification";

export class NotificationService {
    
    notificationRepository: NotificationRepository;

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async fetch(userId:string, size?: number, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            await this.findOne(lastItemId);
            posts = await this.notificationRepository.fetch(userId, size, lastItemId);
        } else {
            posts = await this.notificationRepository.fetch(userId, size);
        }
        return posts;
    }

    async findOne(id: string): Promise<any> {
        const post = await this.notificationRepository.findOne(id);
        if (!post) {
            throw new NotFoundException('notification');
        } else {
            return post;
        }
    }

    async deleteNotification(id: string) {
        await this.findOne(id);
        await this.notificationRepository.deleteNotification(id);
    }

    async createNotification(userId: string, data: Notification) {
        const createdNotification = await this.notificationRepository.createNotification(userId, data);
        return createdNotification;
    }

}
