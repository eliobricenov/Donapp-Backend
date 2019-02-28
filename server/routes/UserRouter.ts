import { Request, Response, Router, NextFunction } from "express";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { createUserMiddleware, loginMiddleware, imageTest } from "../middlewares/userMiddleware";
import { getToken } from "../middlewares/jwt";


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
        this.router.post('/login', loginMiddleware, this.login);
        this.router.post('/token/refresh', this.refreshToken);
        this.router.post('/logout', this.logout);
        this.router.post('/confirmationEmail/:token', this.activateUser);
        this.router.get('/username/:username', this.usernameExists);
        this.router.get('/email/:email', this.emailExists);
        this.router.put('/id/:id', this.updateUser);
        this.router.delete('/id/:id', this.deleteUser);
        this.router.post('/testLogin', getToken, this.testLogin);




        this.router.post('/image', imageTest, this.testImage);
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
        const { username, password } = req.body;
        try {
            const [token, refreshToken] = await this.userService.doLogIn(username, password);
            res.status(200).json({ status: 200, token, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { token, refreshToken } = req.body;
        try {
            const newToken = await this.userService.refreshToken(token, refreshToken);
            res.status(200).json({ status: 200, newToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.body;
            await this.userService.doLogOut(token);
            res.status(200).json({ status: 200 });
        } catch (error) {
            next(error);
        }
    }

    usernameExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username } = req.params;
            const status: number = await this.userService.usernameExists(username) ? 409 : 200;
            res.status(status).json({ status });
        } catch (error) {
            next(error);
        }
    }

    emailExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email } = req.params;
            const status: number = await this.userService.emailExists(email) ? 409 : 200;
            res.status(status).json({ status });
        } catch (error) {
            next(error);
        }
    }

    activateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;
            console.log(token);
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
            const response = await this.userService.create(data);
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

    testLogin = async (req: Request, res: Response): Promise<void> => {
        res.json({ status: 200 });
    }

    testImage = async (req: Request, res: Response): Promise<void> => {
        console.log(req.file);
        res.json({ status: 200 });
    }
}

export default new UserRouter().router;