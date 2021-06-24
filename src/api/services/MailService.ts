import { Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Mail } from '../models/Mail';
import nodemailer = require('nodemailer');
import { ResponseMessage } from '../Common';
import { GeneralResponse } from '../controllers/responses/CommonResponse';
import { env } from '../../env';

@Service()
export class MailService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async sendEmail(email: Mail): Promise<GeneralResponse> {
        this.log.info('Send Email.');

        const mail = nodemailer.createTransport({
            service: env.email.service,
            auth: {
              user: env.email.user,
              pass: env.email.password,
            },
        });

        const mailOptions = {
            from: email.from,
            to: email.to,
            subject: email.subject,
            html: email.html || undefined,
            text: email.text || undefined,
        };

        mail.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
              console.log('Email Sending Error: ', error);
              return { status: ResponseMessage.FAILED, res: error };
            } else {
              console.log('Email sent: ' + info.response);
              return { status: ResponseMessage.SUCCEEDED, res: info.response };
            }
        });

        return { status: ResponseMessage.SUCCEEDED, res: undefined };
    }
}
