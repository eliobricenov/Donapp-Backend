import { Request, Response, Router, NextFunction } from "express";
import { UserService } from "../service/UserService";
import { User } from "../model/User";

/**
 * User router that handles all request related to users
 */
export class UserRouter {

    router: Router;
    userService: UserService;

    constructor() {
        this.router = Router();
        this.userService = new UserService();
        this.config();
    }

    /**
     * Setup of all the endpoints of this router
     */
    config(): void {
        this.router.get('/', this.getAllUsers);
        this.router.get('/id/:id', this.getOneUser)
        this.router.post('/', this.createUser);
        this.router.put('/id/:id', this.updateUser);
        this.router.delete('/id/:id', this.deleteUser);
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users: User[] = await this.userService.findAll();
            res.json({ status: 200, data: users });
        } catch (error) {
            next(error);
        }
    }

    async getOneUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const user: User = await this.userService.findOne(id);
        res.json({ status: 200, data: user });
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const data: User = <User>req.body;
        throw new Error("Method not implemented.");
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        throw new Error("Method not implemented.");
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
