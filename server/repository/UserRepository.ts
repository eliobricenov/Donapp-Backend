import { v4 } from 'uuid';

import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";
import { Token } from '../util/helper/Token';
import moment = require('moment');
import db = require('../util/db');


export class UserRepository {

    private STATUS = { ACTIVE: 1, INACTIVE: 2 };

    async findAll(): Promise<User[]> {
        const users = await pgp.manyOrNone(userQueries.findAll);
        return users;
    }

    async findOne(id: string): Promise<User> {
        const user = await pgp.oneOrNone(userQueries.findOne, { id });
        return user;
    }

    async create(data: User): Promise<User> {
        const id = v4();
        const { username, email, password } = data;
        const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        await pgp.none(userQueries.createUserV1, { id, username, email, password, createdAt });
        return { id, username, email, password, createdAt }

    }

    async findByUsername(username: string): Promise<User> {
        const user: User = await pgp.one(userQueries.findUserByUsername, { username });
        return user;
    }

    async edit(data: User, file: Express.Multer.File): Promise<{}> {
        const updatedUser = await pgp.tx(async tx => {
            const { id, name, lastName } = data;
            const avatarId = v4();
            const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            const avatarPath = file.path;
            const avatarName = file.filename;
            const url = `uploads/${avatarName}`;
            await tx.none(userQueries.registerAvatar, { avatarId, avatarPath, createdAt, url});
            await tx.func('usp_update_user', [id, name, lastName, avatarId]);
            return { name, lastName, url }
        })
        return updatedUser;
    }

    delete(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async checkUserCredentials(username: string, password: string): Promise<boolean> {
        const user: User = await pgp.one(userQueries.findUserByUsername, { username });
        return password == user.password;
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
        await pgp.none(userQueries.createEmailConfirmation, { id, userId, token, expiresIn });
    }

    async findUserByConfirmationToken(token: string): Promise<User> {
        const user = await pgp.oneOrNone(userQueries.findUserByConfirmationToken, { token });
        return user;
    }

    async deleteEmailConfirmationToken(id: string): Promise<void> {
        await pgp.none(userQueries.deleteEmailConfirmation, { id });
    }

    async activateUser(token: string, user: User) {
        db.tx(async tx => {
            await tx.none(userQueries.updateUserStatus, { id: user.id, status: this.STATUS.ACTIVE });
            const { id: confirmationTokenId } = <Token>await tx.oneOrNone(userQueries.findConfirmationToken, { token });
            await pgp.none(userQueries.deleteEmailConfirmation, { id: confirmationTokenId });
        })
    }

}