import { PostService } from "./PostService";
import { RequestRepository } from "../repository/RequestRepository";
import { types } from "../util/sql/queries";
import { Post } from "../model/Post";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { PostRequest } from "../model/PostRequest";
import { DonationRepository } from "../repository/DonationRepository";

export class RequestService<T extends RequestRepository> {
    
    postService: PostService;
    requestRepository: T;

    constructor(TCreator: { new(): T; }) {
        this.postService = new PostService();
        this.requestRepository = new TCreator();
    }

    async fetch(size?: number, lastItemId?: string) {
        if (lastItemId) {
            await this.findOne(lastItemId);
            const posts = await this.requestRepository.fetch(size, lastItemId);
            return posts;
        } else {
            const posts = await this.requestRepository.fetch(size);
            return posts;
        }
    }

    async findOne(id: string): Promise<PostRequest> {
        const post = await this.requestRepository.findOne(id);
        if (!post) {
            throw new NotFoundException('post');
        } else {
            return post;
        }
    }

    async acceptRequest(requestId: string) {
        await this.requestRepository.acceptRequest(requestId);
    }

    async deleteRequest(id: string) {
        await this.findOne(id);
        await this.requestRepository.deleteRequest(id);
    }


    async createDonation(userId: string, data: Post, images: Express.Multer.File[]) {
        data.type = types.DONATION;
        const createdPost = await this.postService.createPost(userId, data, images);
        const createdRequest = await this.requestRepository.createRequestPost(userId, createdPost.id);
        return createdRequest;
    }

    async createExchange(userId: string, data: Post, images: Express.Multer.File[]) {
        data.type = types.EXCHANGE;
        const createdPost = await this.postService.createPost(userId, data, images);
        const createdRequest = await this.requestRepository.createRequestPost(userId, createdPost.id);
        return createdRequest;
    }

    test() {
        this.requestRepository.test();
    }
}
