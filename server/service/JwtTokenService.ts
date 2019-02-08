import { sign, verify, VerifyErrors } from 'jsonwebtoken';

export class JwtTokenService {

    private static SECRET = 'Chikilukis';

    static generate(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign({ token }, this.SECRET, (err: Error, token: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            })
        });
    }

    static decode(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            verify(token, this.SECRET, (err: VerifyErrors, decoded: string | object) => {
                if (err) {
                    console.log(err);
                    reject({
                        status: 403,
                        errors: [{
                            message: 'Invalid Token'
                        }]
                    });
                } else {
                    resolve(<string> decoded);
                }
            })
        });
    }
}