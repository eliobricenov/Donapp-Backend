import * as nodemailer from 'nodemailer';
import { Token } from '../util/helper/Token';
import { emailConfig } from '../util/config';
import { CannotSendEmailException } from '../util/exceptions/CannotSendEmailException';
import smtpTransport from 'nodemailer-smtp-transport';

const host = process.env.host || 'localhost:3000';

export class MailService {


    static sendConfirmationEmail = async (email: string, _token: Token): Promise<void> => {
        const { token } = _token;
        const transporter = nodemailer.createTransport(smtpTransport(emailConfig.config));
        const mailOptions = {
            from: 'noreply@chikilukis.com',
            to: email,
            subject: 'Account Verification Token',
            html: `<h1>Hello, \n\n Please verify your account by clicking this link:</h1>
                <a hre="http:${host}:/confimationEmail/${token}"></a>
            `
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('email error');
            console.log(error);
            throw new CannotSendEmailException(email);
        }
    }
}