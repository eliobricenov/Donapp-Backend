import { v4 } from 'uuid';

import { User } from "../model/User";
import pgp from "../util/db";
import { userQueries } from "../util/sql/queries";
import { Token } from '../util/helper/Token';
import { getCurrentMoment } from '../util/helper/util';


export class UserRepository {

    private STATUS = { ACTIVE: 1, INACTIVE: 2 };

    async findOne(id: string): Promise<User> {
        const user = await pgp.oneOrNone(userQueries.findOne, { id });
        return user;
    }

    async create(data: User): Promise<User> {
        const id = v4();
        const { username, email, password } = data;
        const createdAt = getCurrentMoment();
        await pgp.none(userQueries.createUserV1, { id, username, email, password, createdAt });
        return { id, username, email, password, createdAt }

    }

    async findByUsername(username: string): Promise<User> {
        const user: User = await pgp.one(userQueries.findUserByUsername, { username });
        return user;
    }

    async edit(data: User, avatar?: Express.Multer.File): Promise<{}> {
        const updatedUser = await pgp.tx(async tx => {
            const { id, name, lastName, state } = data;
            const avatarId = v4();
            const createdAt = getCurrentMoment();

            // checking the avatar information only if there was a new avatar uploaded
            const [avatarPath, avatarName] = avatar ? [avatar.path, avatar.filename] : ['', ''];
            const url = `uploads/${avatarName}`;

            //if there was a new avatar uploaded then the actions must be registering the image and editing
            //the existing user information if not then just update the user information
            const updates = avatar ? Promise.all([
                tx.none(userQueries.registerAvatar, { avatarId, avatarPath, createdAt, url }),
                tx.func('usp_update_user', [id, name, lastName, avatarId, state])
            ]) : [tx.func('usp_update_user', [id, name, lastName, state])];
            
            await updates; //execute actions
            return avatar ? { name, lastName, url } : { name, lastName };
        })
        return updatedUser;
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

    async findUserByConfirmationToken(id: string): Promise<User> {
        const user = await pgp.oneOrNone(userQueries.findUserByConfirmationToken, { id });
        return user;
    }

    async deleteEmailConfirmationToken(id: string): Promise<void> {
        await pgp.none(userQueries.deleteEmailConfirmation, { id });
    }

    async activateUser(token: string, user: User) {
        pgp.tx(async tx => {
            await tx.none(userQueries.updateUserStatus, { id: user.id, status: this.STATUS.ACTIVE });
            const { id: confirmationTokenId } = <Token> await tx.oneOrNone(userQueries.findConfirmationToken, { token });
            await pgp.none(userQueries.deleteEmailConfirmation, { id: confirmationTokenId });
        })
    }

    async getAvatarInformation(id: string) {
        const avatar = await pgp.oneOrNone(userQueries.getAvatarInformation, { id });
        return avatar;
    }

    async disableUser(id: string) {
        await pgp.none(userQueries.updateUserStatus, { id, status: this.STATUS.INACTIVE });
    }

}