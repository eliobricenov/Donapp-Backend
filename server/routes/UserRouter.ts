import { Request, Response, Router, NextFunction } from "express";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { createUserMiddleware, loginMiddleware } from "../middlewares/userMiddleware";
import { upload } from "../middlewares/multer";


/**
 * User router that handles all request related to users
 * @todo delete getAll() endpoint once it is not used anymore, it is not safe
 */
class UserRouter {

    router: Router;
    userService: UserService;

    constructor() {
        this.router = Router();
        this.userService = new UserService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/', this.getAllUsers);
        this.router.get('/id/:id', this.getOneUser)
        this.router.post('/', createUserMiddleware, this.createUser);
        this.router.post('/login', loginMiddleware, this.createUser);
        this.router.post('/confirmationEmail/:token', this.activateUser);
        this.router.get('/username/:username', this.usernameExists);
        this.router.get('/email/:email', this.emailExists);
        this.router.put('/id/:id', this.updateUser);
        this.router.delete('/id/:id', this.deleteUser);
    }

    getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users: User[] = await this.userService.findAll();
            res.json({ status: 200, data: users });
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.send(200);
        } catch (error) {
            console.log('ERROR');
            next(error);
        }
    }

    usernameExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username } = req.params;
            const status: number = await this.userService.usernameExists(username) ? 200 : 409;
            res.status(status).json({ status });
        } catch (error) {
            next(error);
        }
    }

    emailExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.params;
            const status = await this.userService.emailExists(email) ? 200 : 409;
            res.status(status).json({ status });
        } catch (error) {
            next(error);
        }
    }

    activateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;
            await this.userService.activateUser(token);
            const status = 200;
            res.status(200).json({ status });
        } catch (error) {
            next(error);
        }
    }

    getOneUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const user: User = await this.userService.findOne(id);
        res.json({ status: 200, data: user });
    }

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            const { host } = req.headers;
            const response = await this.userService.create(data, host || 'localhost');
            res.status(200).json({ status: 200, data: response });
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        throw new Error("Method not implemented.");
    }

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        throw new Error("Method not implemented.");
    }
}

export default new UserRouter().router;