import { Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/multer";
import { PostService } from "../service/PostService";
import { getToken } from "../middlewares/jwt";
import { JwtTokenService } from "../service/JwtTokenService";
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
        this.router.get('/id/:id', this.findPost);
        this.router.post('/', [getToken, upload.array('pictures')], this.createPost);
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

    createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]> req.files;
            const createdPost = await this.postService.createPost(userId, req.body, files);
            res.json({ status: 200, data: createdPost });
        } catch (error) {
            next(error)
        }
    }

    updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userID!;
            const files = <Express.Multer.File[]> req.files;
            const updatePost = await this.postService.createPost(userId, req.body, files);
            res.json({ status: 200, data: updatePost });
        } catch (error) {
            next(error)
        }
    }
}

export default new PostRouter().router;