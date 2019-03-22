import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { Token } from '../util/helper/Token';
import crypto from 'crypto';
import { v4 } from 'uuid';
import moment = require('moment');

export class TokenService {

    private static SECRET = 'Chikilukis';

    static generateWithUserId(userId: string, days?: number): Token {
        const key = crypto.createCipher('aes-128-cbc', this.SECRET);
        const token = key.update(userId, 'utf8', 'hex');
        const expiresIn: string = days ? moment(Date.now()).add(days, 'days').format('YYYY-MM-DD HH:mm:ss') : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const id = v4();
        return { id, userId, token, expiresIn }
    }

}