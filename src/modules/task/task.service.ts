import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionService } from '../transactions';
import { UsersService } from '../users';

@Injectable()
export class TaskService {
  protected readonly logger = new Logger(TaskService.name);

  constructor(
    private emailService: EmailService,
    private transactionService: TransactionService,
    private userService: UsersService,
  ) {}

  @Cron('0 8 15 * *')
  async handleCron() {
    const users = await this.userService.getAllUsers();

    for (const user of users) {
      const summary: any = await this.transactionService.getTransactionSummary(
        user.id,
      );

      await this.emailService.sendEmail({
        email: user.email,
        subject: 'Unpaid Commission Summary',
        data: {
          title: '',
          content: `Below is your unpaid commission summary`,
          tail: 'Regards, Zapier Team',
          total_sales_amount: summary[0].total_sales_amount,
          total_commission_amount: summary[0].total_commission_amount,
        },
        template: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unpaid Sales Report</title>
      </head>
      <body>
          <h4>Hi,</h4>
          </br>
          <p><%=content%></p>
          </br>
          </br>
          <table>
          <thead>
          <tr>
          <th>Total Sales Amount (KES)</th>
          <th>Total Commission Amount (KES)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
          <td><%= total_sales_amount %></td>
          <td><%= total_commission_amount %></td>
          </tr>
          </tbody>
          </table>
          </br>
          </br>
          <p><%=tail%></p>
      </body>
      </html>
    `,
      });
    }
  }
}
