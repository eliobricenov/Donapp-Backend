import { UserRepository } from "../repository";
import { User } from "../model/User";
import { MailService } from "./MailService";
import { Token } from "../util/helper/Token";
import { TokenService } from "./TokenService";
import { CannotSendEmailException } from "../util/exceptions/CannotSendEmailException";
import { TokenNotValidException } from "../util/exceptions/TokenNotValidException";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async create(data: User, host: string): Promise<User> {
        const user = await this.userRepository.create(data);
        await this.sendConfirmationEmail(user.id, user.email, host);
        return user;
    }

    usernameExists(username: string): Promise<boolean> {
        return this.userRepository.usernameExists(username);
    }

    emailExists(email: string): Promise<boolean> {
        return this.userRepository.emailExists(email);
    }

    async activateUser(token: string): Promise<void> {
        const { id } = await this.userRepository.findUserByConfirmationToken(token);
        if (id) {
            await this.userRepository.changeUserStatus(id, UserRepository.STATUS.ACTIVE);
            await this.userRepository.deleteEmailConfirmationToken(id);
        } else {
            throw new TokenNotValidException();
        }
    }

    private async sendConfirmationEmail(userId: string, email: string, host: string): Promise<void> {
        const token = TokenService.generateWithUserId(userId, 1);
        await this.userRepository.createEmailConfirmationToken(token);
        try {
            await MailService.sendConfirmationEmail(email, token, host);
        } catch(error) {
            await this.userRepository.deleteEmailConfirmationToken(token.id);
            throw error;
        }
    }
}