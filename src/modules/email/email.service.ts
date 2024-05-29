import { Injectable, Logger } from '@nestjs/common';
import { MailgunMessageData, MailgunService } from 'nestjs-mailgun';
import { SendEmailDto } from '@/shared/constants/types';

const ejs = require('ejs');
const path = require('path');

@Injectable()
export class EmailService {
  protected readonly logger = new Logger(EmailService.name);

  constructor(private mailgunService: MailgunService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    const emailOptions: MailgunMessageData = {
      'from': 'zapier@touchinspiration.net',
      'to': sendEmailDto.email,
      'subject': sendEmailDto.subject,
      'html': '',
      'attachment': '',
      'cc': '',
      'bcc': '',
      'o:testmode': 'no',
      'h:X-Mailgun-Variables': '{"key":"value"}',
    };

    const html = ejs.render(sendEmailDto.template, sendEmailDto.data);

    emailOptions.html = html;

    try {
      await this.mailgunService.createEmail(
        'touchinspiration.net',
        emailOptions,
      );
      this.logger.log(
        `Email with subject: ${sendEmailDto.subject} sent to ${sendEmailDto.email} successfully`,
      );
    } catch (error) {
      this.logger.error(
        `Email with subject: ${sendEmailDto.subject} sent to ${sendEmailDto.email} failed, cause: ${error}`,
      );
    }
  }
}
