import { sign, verify, VerifyErrors, TokenExpiredError } from 'jsonwebtoken';
import { HttpException } from '../util/exceptions/HttpException';

export class JwtTokenService {

    private static SECRET = 'Chikilukis';

    static generate(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign({ userId }, this.SECRET, (err: Error, token: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })
        });
    }

    static decode(token: string): Promise<{}> {
        return new Promise((resolve) => {
            try {
                const payload = verify(token, this.SECRET);
                resolve(payload);
            } catch (err) {
                switch (err) {
                    case err instanceof TokenExpiredError:
                        throw new HttpException(403, 'Expired Token')
                    default:
                        throw new HttpException(403, 'Invalid Token')
                }
            }
        });
    }

    static generateConfirmationToken(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign({ userId }, this.SECRET, { expiresIn: '1d' }, (err: Error, token: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })
        });
    }

}