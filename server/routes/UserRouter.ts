import { Request, Response, Router, NextFunction } from "express";
import { UserService } from "../service/UserService";
import { createUserMiddleware, loginMiddleware } from "../middlewares/userMiddleware";
import { getToken } from "../middlewares/jwt";
import { upload } from "../middlewares/multer";


/**
 * User router that handles all request related to users
 * @todo 
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
        this.router.get('/info/', getToken,this.getOneUser)
        this.router.post('/', createUserMiddleware, this.createUser);
        this.router.post('/login', loginMiddleware, this.login);
        this.router.post('/logout', this.logout);
        this.router.post('/confirmationEmail/:token', this.activateUser);
        this.router.get('/username/:username', this.usernameExists);
        this.router.get('/email/:email', this.emailExists);
        this.router.delete('/id/:id', this.deleteUser);
        this.router.post('/update', [getToken, upload.single('avatar')], this.updateUser)

        this.router.post('/test', this.test);
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

    getOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req;
            const { name, lastName, email, username, phone, avatar } = await this.userService.findOne(token!);
            res.json({ status: 200, data: { name, lastName, email, username, phone, avatar } });
        } catch (error) {
            next(error);
        }
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

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { body, token, file } = req;
            const response = await this.userService.edit(body, token!, file);
            console.log(file, response);
            res.status(200).json({ status: 200, data: response });
        } catch (error) {
            console.log('error');
            next(error);
        }
    }

    deleteUser = async (): Promise<void> => {
        throw new Error("Method not implemented.");
    }


    test = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }
}

export default new UserRouter().router;