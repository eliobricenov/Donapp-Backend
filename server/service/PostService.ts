import { NotFoundException } from "../util/exceptions/NotFoundException";
import { PostRepository } from "../repository/PostRepository";
import { Post } from "../model/Post";
import { removeUnusedImages, singleToArray } from "../util/helper/util";

/**
 * @todo 
 */

export class PostService {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = new PostRepository();
    }

    async fetch(size?: number, lastItemId?: string) {
        if (lastItemId) {
            await this.findOne(lastItemId);
            const posts = await this.postRepository.fetch(size, lastItemId);
            return posts;
        } else {
            const posts = await this.postRepository.fetch(size);
            return posts;
        }
    }

    async findOne(id: string): Promise<Post> {
        const post = await this.postRepository.findPost(id);
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

    async updatePost(userId: string, data: Post, images: Express.Multer.File[]) {
        await this.findOne(data.id);
        data.userId = userId;
        const { deletedPictures } = data;
        await this.findOne(data.id);
        if (deletedPictures) {
            const toDelete = await this.getPostPicturesFromDisk(deletedPictures); //path of the files
            await this.postRepository.deletePostPictures(deletedPictures);
            removeUnusedImages(toDelete);   
        }
        return images ? this.postRepository.updatePost(data, images) : this.postRepository.updatePost(data);
    }

    async deletePost(id: string) {
        await this.findOne(id);
        await this.postRepository.deletePost(id);
    }

    private async getPostPicturesFromDisk(pictures: string | string[]) {
        const _pictures = singleToArray(pictures);
        return await Promise.all(_pictures.map(async picUrl => {
            const picture = await this.postRepository.getPostPicturesByUrl(picUrl);
            return picture.path;
        }))
    }
}