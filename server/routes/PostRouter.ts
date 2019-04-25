import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { PostService } from "../service/PostService";
import { getToken } from "../middlewares/jwt";
import Router from "./Router";

/**
 * User router that handles all request related to users
 * @todo 
 */
class PostRouter extends Router {

    postService: PostService;

    constructor() {
        super();
        this.postService = new PostService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.fetch);
        this.router.get('/id/:id', this.findPost);
        this.router.put('/', upload.array('pictures'), this.updatePost);
        this.router.delete('/id/:id', this.deletePost);
    }

    fetch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { size, lastItem } = req.query;
            const posts = await this.postService.fetch(size, lastItem);
            res.json({ status: 200, data: posts });
        } catch (error) {
            next(error);
        }

    }

    findPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const post = await this.postService.findOne(id);
            res.json({ status: 200, data: post });
        } catch (error) {
            next(error);
        }

    }

    updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]>req.files;
            const updatePost = await this.postService.updatePost(userId, req.body, files);
            res.json({ status: 200, data: updatePost });
        } catch (error) {
            next(error)
        }
    }

    deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            await this.postService.deletePost(id);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }
}

export default new PostRouter().router;