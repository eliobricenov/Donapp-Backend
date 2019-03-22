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

    async createPost(userId: string, post: Post, images: Express.Multer.File[]) {
        post.userId = userId;
        // const x = images.map(image => ({ filename: image.filename, path: image.path }))
        // console.log(x);
        const createdPost = await this.postRepository.createPost(post, images);
        return createdPost;
        // return null;
    }
}