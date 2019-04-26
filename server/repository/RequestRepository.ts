import { requestStatuses, requestQueries, postQueries } from "../util/sql/queries";
import { v4 } from 'uuid';
import pgp from "../util/db";
import { PostRequest } from "../model/PostRequest";
import { getCurrentMoment } from "../util/helper/util";
import { Post } from "../model/Post";


/***
 * @todo CREATE CLASS FOR DONATIONS AND EXCHANGES
 */
export abstract class RequestRepository {

    abstract type: string;

    async fetch(size: number = 4, lastItemId?: string) {
        let posts = [];
        if (lastItemId) {
            posts = await pgp.manyOrNone(requestQueries.fetchWithLimit, { size, id: lastItemId, type: this.type }) || [];
        } else {
            posts = await pgp.manyOrNone(requestQueries.fetch, { size, type: this.type }) || [];
        }
        for (const post of posts) {
            await this.setPostImage(post)
        }
        return posts;
    }

    async findOne(id: string) {
        const post = await pgp.oneOrNone(requestQueries.findOne, { id,});
        return post;
    }

    async createRequestPost(userId: string, data: Post, images: Express.Multer.File[]) {
        const createdRequest = await pgp.tx(async tx => {
            const { description, coordinates, title } = data;
            const requestId = v4();
            const createdAt = getCurrentMoment();
            await tx.none(requestQueries.createRequest, { id: requestId, userId, title, description, coordinates, createdAt, type: this.type });
            const _images = await Promise.all(images.map(async image => {
                const imageId = v4();
                const { path, filename } = image;
                const url = `uploads/${filename}`;
                const createdAt = getCurrentMoment();
                await tx.none(requestQueries.createRequestImage, { id: imageId, requestId, path, createdAt, url });
                return { imageId, url, filename }
            }));
            return { id: requestId, userId, title, description, coordinates, createdAt, images: _images };
        });
        return createdRequest;
    }

    async deleteRequest(id: string) {
        await pgp.none(requestQueries.deleteRequest, { id });
    }

    async setPostImage(post: Post) {
        const images = await pgp.manyOrNone(requestQueries.getImagesFromRequest, { requestId: post.id }) || [];
        post.images = images;
    }

    test() {
        console.log(`My code is ${this.type}!`)
    }



}