import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/UserService";
import { createUserMiddleware, loginMiddleware } from "../middlewares/userMiddleware";
import { getToken } from "../middlewares/jwt";
import { upload } from "../middlewares/multer";
import Router from "./Router";


/**
 * User router that handles all request related to users
 * @todo 
 */
class UserRouter extends Router {

    userService: UserService;

    constructor() {
        super()
        this.userService = new UserService();
        this.config();
    }

    /**
     * Setup of all the endpoints of the router
     */
    config(): void {
        this.router.get('/info/', getToken, this.getOneUser)
        this.router.post('/', createUserMiddleware, this.createUser);
        this.router.post('/login', loginMiddleware, this.login);
        this.router.post('/logout', this.logout);
        this.router.post('/confirmationEmail/:token', this.activateUser);
        this.router.get('/username/:username', this.usernameExists);
        this.router.get('/email/:email', this.emailExists);
        this.router.delete('/', getToken, this.disableUser);
        this.router.post('/update', [getToken, upload.single('avatar')], this.updateUser)

        this.router.post('/test', upload.single('avatar'), this.test);
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { username, password } = req.body;
        try {
            const [token, refreshToken] = await this.userService.doLogin(username, password);
            console.log(token);
            res.status(200).json({ status: 200, token, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.body;
            await this.userService.doLogout(token);
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
            await this.userService.activateUser(token);
            const status = 200;
            res.status(200).json({ status });
        } catch (error) {
            next(error);
        }
    }

    getOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userID } = req;
            const { name, lastName, email, username, phone, avatar } = await this.userService.findOne(userID!);
            res.json({ status: 200, data: { name, lastName, email, username, phone, avatar } });
        } catch (error) {
            next(error);
        }
    }

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;
            const { userID } = req;
            const response = await this.userService.create(data, userID!);
            res.status(200).json({ status: 200, data: response });
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { body, userID, file } = req;
            const response = await this.userService.edit(body, userID!, file);
            res.status(200).json({ status: 200, data: response });
        } catch (error) {
            next(error);
        }
    }

    disableUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userID } = req;
            await this.userService.disableUser(userID!);
            res.status(200).json({ status: 200 });
        } catch (error) {
            next(error);
        }
    }


    test = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log(req.body);
            res.json({ status: 200 });
        } catch (error) {
            next(error)
        }
    }
}

export default new UserRouter().router;