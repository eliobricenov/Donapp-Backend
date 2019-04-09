import { NotFoundException } from "../util/exceptions/NotFoundException";
import { PostRepository } from "../repository/PostRepository";
import { Post } from "../model/Post";

/**
 * @todo 
 */

export class PostService {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = new PostRepository();
    }

    async findOne(postId: string): Promise<Post> {
        const post = await this.postRepository.findPost(postId);
        if (!post) {
            throw new NotFoundException('post');
        } else {
            return post;
        }
    }

    async createPost(userId: string, data: Post, images: Express.Multer.File[]) {
        data.userId = userId;
        const createdPost = await this.postRepository.createPost(data, images);
        return createdPost;
    }

    async updatePost(postId: string, data: Post, images: Express.Multer.File[]) {
        console.log(data);
    }
}