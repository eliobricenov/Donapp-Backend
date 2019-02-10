import { v4 } from 'uuid';

import { Repository } from "./Repository";
import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";
import { Token } from '../util/helper/Token';
import moment = require('moment');

export class UserRepository implements Repository<User> {

    static STATUS = { ACTIVE: 1, INACTIVE: 2 };

    findAll(): Promise<User[]> {
        return pgp.any(userQueries.findAll);
    }

    findOne(id: string): Promise<User> {
        return pgp.one(userQueries.findOne, { id });
    }

    async create(data: User): Promise<User> {
        const id = v4();
        const { username, email, password } = data;
        const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        await pgp.none(userQueries.createUserV1, { id, username, email, password, createdAt });
        return { id, username, email, password, createdAt }

    }

    edit(id: string, data: User): Promise<User> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async usernameExists(username: string): Promise<boolean> {
        const { count } = await pgp.one(userQueries.searchUsername, { username });
        return count > 0;
    }

    async emailExists(email: string): Promise<boolean> {
        const { count } = await pgp.one(userQueries.searchEmail, { email });
        return count > 0;
    }

    async createEmailConfirmationToken(_token: Token): Promise<void> {
        const { id, userId, token, expiresIn } = _token;
        await pgp.none(userQueries.createEmailConfirmation, { id, userId, expiresIn, token });
    }

    async deleteEmailConfirmationToken(id: string): Promise<void> {
        await pgp.none(userQueries.deleteEmailConfirmation, { id });
        console.log(`Deleted email token with id ${id}`);
    }

    async changeUserStatus(userId: string, status: number): Promise<void> {
        await pgp.none(userQueries.updateUserStatus, { userId, status });
        console.log(`Changed ${userId} to ${status}`);
    }

    async findUserByConfirmationToken(token: string): Promise<User> {
        const user: User = await pgp.one(userQueries.findUserByConfirmationToken, { token });
        return user;
    }


}