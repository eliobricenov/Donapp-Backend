import { v4 } from 'uuid';

import { Repository } from "./Repository";
import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";
import { Token } from '../util/helper/Token';
import  moment = require('moment');

export class UserRepository implements Repository<User> {

    findAll(): Promise<User[]> {
        return pgp.any(userQueries.findAll);
    }

    findOne(id: string): Promise<User> {
        return pgp.one(userQueries.findOne, { id });
    }

    async create(data: User): Promise<User> {
        const uuid = v4();
        data.id = uuid;
        const {id, username, email, password } = data;
        const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        console.log(createdAt);
        await pgp.none(userQueries.createUserV1, {id, username, email, password, createdAt});
        return {id, username, email, password, createdAt}

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

    async createEmailConfirmationToken(userId: string): Promise<Token> {
        let expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1)
        const expiresIn = expireDate.toDateString();
        const id = v4().toString();
        await pgp.none(userQueries.createEmailConfirmation, { id, userId, expiresIn });
        return { id, userId, expiresIn };
    }

    deleteEmailConfirmationToken(id: string): Promise<null> {
        return pgp.none(userQueries.deleteEmailConfirmation);
    }


}