import { UserRepository } from "../repository";
import { User } from "../model/User";

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

    async create(data: User): Promise<User> {
        return await this.userRepository.create(data);
    }

    usernameExists(username: string): Promise<boolean> {
        return this.userRepository.usernameExists(username);
    }

    emailExists(email: string): Promise<boolean> {
        return this.userRepository.emailExists(email);
    }

    private async sendConfirmationEmail(userId: string) {
        
    }
}