import * as nodemailer from 'nodemailer';
import { Token } from '../util/helper/Token';
import { emailConfig } from '../util/config';
import { CannotSendEmailException } from '../util/exceptions/CannotSendEmailException';

export class MailService {

    static sendConfirmationEmail = async (email: string, _token: Token, host: string): Promise<void> => {
        const { token } = _token;
        const transporter = nodemailer.createTransport(emailConfig.config);
        const mailOptions = {
            from: 'noreply@chikilukis.com',
            to: email,
            subject: 'Account Verification Token',
            text: `Hello, \n\n Please verify your account by clicking the link: \n http:${host}/confimationEmail/${token}`
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('email error');
            throw new CannotSendEmailException(email);
        }
    }

}