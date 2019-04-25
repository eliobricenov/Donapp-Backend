import { requestStatuses, requestQueries } from "../util/sql/queries";
import { v4 } from 'uuid';
import pgp from "../util/db";
import { PostRequest } from "../model/PostRequest";


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
        return posts;
    }

    async findOne(id: string) {
        const post = await pgp.oneOrNone(requestQueries.findOne, { id,});
        return post;
    }

    async createRequestPost(userId: string, postId: string) {
        const id = v4();
        const requestStatus = requestStatuses.AWAITING_APPROVAL;
        await pgp.none(requestQueries.createRequest, { id, postId, requestStatus, userId, type: this.type });
        return { id, postId, sourceId: userId }
    }

    async deleteRequest(id: string) {
        await pgp.none(requestQueries.deleteRequest, { id });
    }

    async acceptRequest(requestId: string) {
        const requestStatus = requestStatuses.ACCEPTED;
        await pgp.none(requestQueries.changeRequestStatus, { requestId, requestStatus });
    }

    test() {
        console.log(`My code is ${this.type}!`)
    }



}