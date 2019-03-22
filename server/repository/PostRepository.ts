import { v4 } from 'uuid';

import pgp from "../util/db";
import moment = require('moment');
import { Post } from '../model/Post';
import { postQueries } from '../util/sql/queries';
import { getCurrentMoment } from '../util/helper/util';


export class PostRepository {

    async findPost(postId: string) {
        const post = await pgp.oneOrNone(postQueries.getPostInformation, { postId });
        if (!post) {
            return post;
        } else {
            post.images = await pgp.many(postQueries.getImagesFromPost, { postId })
            return post;
        }
    }

    async createPost(post: Post, images: Express.Multer.File[]) {
        const createdPost = await pgp.tx(async tx => {
            const { userId, description, coordinates, title } = post;
            const postId = v4();
            const createdAt = getCurrentMoment();
            await tx.none(postQueries.createPost, { id: postId, userId, title, description, coordinates, createdAt, postType: 1 });
            const _images = await Promise.all(images.map(async image => {
                const imageId = v4();
                const { path, filename } = image;
                const url = `uploads/${filename}`;
                const createdAt = getCurrentMoment();
                await tx.none(postQueries.createPostImage, { id: imageId, postId, path, createdAt, url });
                return { imageId, url, filename }
            }));

            return { id: postId, userId, title, description, coordinates, createdAt, images: _images };
        });

        return createdPost;
    }

}