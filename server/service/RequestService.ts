import { RequestRepository } from "../repository/RequestRepository";
import { types } from "../util/sql/queries";
import { Post } from "../model/Post";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { PostRequest } from "../model/PostRequest";

export class RequestService<T extends RequestRepository> {
    
    requestRepository: T;

    constructor(TCreator: { new(): T; }) {
        this.requestRepository = new TCreator();
    }

    async fetch(size?: number, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            await this.findOne(lastItemId);
            posts = await this.requestRepository.fetch(size, lastItemId);
        } else {
            posts = await this.requestRepository.fetch(size);
        }
        return posts;
    }

    async findOne(id: string): Promise<PostRequest> {
        const post = await this.requestRepository.findOne(id);
        if (!post) {
            throw new NotFoundException('request');
        } else {
            return post;
        }
    }

    async deleteRequest(id: string) {
        await this.findOne(id);
        await this.requestRepository.deleteRequest(id);
    }


    async createDonation(userId: string, data: Post, images: Express.Multer.File[]) {
        data.type = types.DONATION;
        const createdRequest = await this.requestRepository.createRequestPost(userId, data, images);
        return createdRequest;
    }

    async createTrade(userId: string, data: Post, images: Express.Multer.File[]) {
        data.type = types.EXCHANGE;
        const createdRequest = await this.requestRepository.createRequestPost(userId,  data, images);
        return createdRequest;
    }
}
