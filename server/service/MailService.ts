import * as nodemailer from 'nodemailer';
import { Token } from '../util/helper/Token';
import { emailConfig } from '../util/config';

export class MailService {

    static sendEmail(email: string, token: Token, host: string): Promise<{}> {
        const transporter = nodemailer.createTransport(emailConfig.config);
        const mailOptions = {
            from: 'noreply@chikilukis.com',
            to: email,
            subject: 'Account Verification Token',
            text: `Hello, \n\n Please verify your account by clicking the link: \n http:${host}/${host}/confimation/${token}`
        };
        return transporter.sendMail(mailOptions);
    }

}