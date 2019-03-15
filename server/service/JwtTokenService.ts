import { sign, verify, TokenExpiredError } from 'jsonwebtoken';
import { HttpException } from '../util/exceptions/HttpException';
import { redisClient, redisClientAsync } from '../util/redis';
import { JwtToken } from '../util/helper/JwtToken';
import { reject } from 'bluebird';
import { ExpiredTokenException } from '../util/exceptions/ExpiredTokenException';
import { NotValidTokenException } from '../util/exceptions/NotValidTokenException';

export class JwtTokenService {

    private static SECRET = 'jtrbdfgbdgs4dcd8d4W4D8WE48WE4D8s';

    private static SECRET_REFRESH = 'asdcasdcasdfaasdc5w5qw';

    private static REF_LIST = 'ref-tkns';

    static generateToken(data: any, secret?: string, duration?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign({ data }, secret || this.SECRET, { algorithm: 'HS256', expiresIn: duration || '30m', }, (err: Error, token: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })
        });
    }

    static decode(token: string, secret?: string, ignoreExp?: boolean): Promise<JwtToken> {
        return new Promise((resolve, reject) => {
            try {
                const payload = verify(token, secret || this.SECRET, {ignoreExpiration: ignoreExp || false});
                resolve(JSON.parse(JSON.stringify(payload)));
            } catch (err) {
                switch (err) {
                    case err instanceof TokenExpiredError:
                        reject(new ExpiredTokenException(token))
                    default:
                        reject(new NotValidTokenException(token))
                }
            }
        });
    }

    static async generateRefreshToken(token: string) {
        const refreshToken = await this.generateToken(token, this.SECRET_REFRESH, '7d');
        const { data } = await this.decode(token);
        redisClient.hset(this.REF_LIST, data.id, refreshToken);
        return refreshToken;
    }

    static async refreshToken(token: string, refreshToken: string) {
        verify(refreshToken, this.SECRET_REFRESH);
        const { data } = await this.decode(token, this.SECRET, true);
        const found = await redisClientAsync.hexists(this.REF_LIST, data.id);
        if (found) {
            const newToken = await this.generateToken(data);
            return newToken;
        } else {
            throw new NotValidTokenException(token);
        }
    }

    static async invalidateRefreshToken(token: string) {
        const { data } = await this.decode(token, this.SECRET);
        redisClientAsync.hdel(this.REF_LIST, data.id);
    }

}