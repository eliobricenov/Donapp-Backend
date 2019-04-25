export interface PostRequest {
    id: string;
    sourceUser: string;
    targetUser?: string;
    postId: string;
    status: string;
}