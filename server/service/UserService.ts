import { UserRepository } from "../repository";
import { User } from "../model/User";
import { MailService } from "./MailService";
import { TokenService } from "./TokenService";
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

    async activateUser(_token: string): Promise<void> {
        const token = await this.userRepository.findUserByConfirmationToken(_token);
        if (token) {
            await this.userRepository.changeUserStatus(token.id, UserRepository.STATUS.ACTIVE);
            const { id: tokenId } = await this.userRepository.findConfirmationTokenByContent(token.id);
            await this.userRepository.deleteEmailConfirmationToken(tokenId);
        } else {
            throw new TokenNotValidException();
        }
    }

    private async sendConfirmationEmail(userId: string, email: string, host: string): Promise<void> {
        const token = TokenService.generateWithUserId(userId, 1);
        await this.userRepository.createEmailConfirmationToken(token);
        try {
            await MailService.sendConfirmationEmail(email, token, host);
        } catch (error) {
            await this.userRepository.deleteEmailConfirmationToken(token.id);
            throw error;
        }
    }
}