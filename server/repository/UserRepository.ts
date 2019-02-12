import { v4 } from 'uuid';

import { Repository } from "./Repository";
import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";
import { Token } from '../util/helper/Token';
import moment = require('moment');
import db = require('../util/db');
import { SecurityQuestion } from '../model/SecurityQuestion';


export class UserRepository implements Repository<User> {

    static STATUS = { ACTIVE: 1, INACTIVE: 2 };

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
        const user = await pgp.oneOrNone(userQueries.findUserByConfirmationToken, { token });
        return user;
    }

    async findConfirmationTokenByContent(content: string): Promise<Token> {
        console.log(content);
        const token = await pgp.oneOrNone(userQueries.findConfirmationToken, { content });
        console.log(token);
        return token;
    }

    async setSecurityQuestions(userId: string, questions: any[]) {
        db.tx(async tx => {
            questions.forEach(async _question => {
                const { name, answer } = _question;
                const { id: questionId }: SecurityQuestion = await tx.one(userQueries.findSecurityQuestionByName, { name });
                const id = v4();
                await tx.none(userQueries.createSecurityAnswer, { id, userId, questionId, answer });
            })
        })
    }

}