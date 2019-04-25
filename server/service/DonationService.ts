import { PostService } from "./PostService";
import { RequestRepository } from "../repository/RequestRepository";
import { types } from "../util/sql/queries";
import { Post } from "../model/Post";
import { NotFoundException } from "../util/exceptions/NotFoundException";
import { PostRequest } from "../model/PostRequest";
import { DonationRepository } from "../repository/DonationRepository";

export class RequestService {
    
    postService: PostService;
    donationRepository: DonationRepository;

    constructor() {
        this.postService = new PostService();
        this.donationRepository = new DonationRepository();
    }

    async fetch(size?: number, lastItemId?: string) {
        if (lastItemId) {
            await this.findOne(lastItemId);
            const posts = await this.donationRepository.fetch(size, lastItemId);
            return posts;
        } else {
            const posts = await this.donationRepository.fetch(size);
            return posts;
        }
    }

    async findOne(id: string): Promise<PostRequest> {
        const post = await this.donationRepository.findOne(id);
        if (!post) {
            throw new NotFoundException('post');
        } else {
            return post;
        }
    }

    async acceptRequest(requestId: string) {
        await this.donationRepository.acceptRequest(requestId);
    }

    async deleteRequest(id: string) {
        await this.findOne(id);
        await this.donationRepository.deleteRequest(id);
    }


    async createDonation(userId: string, data: Post, images: Express.Multer.File[]) {
        data.type = types.DONATION;
        const createdPost = await this.postService.createPost(userId, data, images);
        const createdRequest = await this.donationRepository.createRequestPost(userId, createdPost.id);
        return createdRequest;
    }
}