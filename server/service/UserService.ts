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

    create(data: User) {
        console.log(data);
    }
}