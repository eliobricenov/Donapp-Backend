import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { Token } from '../util/helper/Token';
import * as crypto from 'crypto';

export class TokenService {

    private static SECRET = 'Chikilukis';

    static generateWithUserId(userId: string): Token {
        const key = crypto.createCipher('aes-128-cbc', this.SECRET);
        const token = key.update(userId, 'utf8', 'hex');
        const createdAt: string = Date.now().toString();
        return { userId, token, createdAt }
    }

}