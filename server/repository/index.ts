import { UserRepository } from './UserRepository';

// Database Interface Extensions:
interface IExtensions {
    users: UserRepository,
}

export {
    IExtensions,
    UserRepository,
};
