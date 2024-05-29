import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { EmailService } from '../email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  GenerateReportTransactionReportDateDto,
  GetTransactionByDateDto,
} from './dtos/get-transaction-summary.dto';
import { JwtAuthGuard } from '../auth/guard/JWT-auth.guard';
import { Request } from 'express';
import { Serialize } from '@/interceptor/serializer.interceptor';
import { Transaction } from './schemas/transaction.schema';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { User } from '../users/schemas/user.schema';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@Serialize(TransactionDto)
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionService,
    private emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createTransaction(
    @Req() req: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const userId = (req.user as User).id;
    return this.transactionService.createTransaction(
      userId,
      createTransactionDto,
    );
  }

  @Post('report')
  async generateTransactionsReportByUser(
    @Req() req: Request,
    @Body() getTransactionSummaryDto: GenerateReportTransactionReportDateDto,
  ) {
    const userId = (req.user as User).id;
    const transactions =
      await this.transactionService.getAllTransactionsByUserAndDate(
        userId,
        getTransactionSummaryDto,
      );
    this.eventEmitter.emit(
      'send_sales_transaction_summary',
      transactions,
      getTransactionSummaryDto.email,
    );
    return transactions;
  }

  @Get()
  async getAllTransactionsByUser(
    @Req() req: Request,
    @Body() getTransactionSummaryDto: GetTransactionByDateDto,
  ) {
    const userId = (req.user as User).id;
    if (
      getTransactionSummaryDto.end_date &&
      getTransactionSummaryDto.start_date
    ) {
      return this.transactionService.getAllTransactionsByUserAndDate(
        userId,
        getTransactionSummaryDto,
      );
    }

    return this.transactionService.getAllTransactionsByUser(userId);
  }

  @Get(':id')
  async getTransactionByID(@Param('id') transactionId, @Req() req: Request) {
    return this.transactionService.getTransactionByAttribute({
      id: transactionId,
    });
  }

  @Patch(':id')
  async updateTransactionStatusByID(
    @Param('id') transactionId,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: Request,
  ) {
    return this.transactionService.updateTransactionByAttribute(
      transactionId,
      updateTransactionDto,
    );
  }

  @OnEvent('send_sales_transaction_summary')
  handleGenerateReportEvent(transactions: Transaction[], email: string) {
    this.emailService.sendEmail({
      email,
      subject: 'Sales Transaction Statement',
      data: {
        title: 'Sales Transaction Statment',
        content: `Below is your sales transaction report`,
        tail: 'Regards, Zapier Team',
        transactions,
      },
      template: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sales Transaction Report</title>
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
        <th>Product</th>
        <th>Sales Amount (KES)</th>
        <th>Commission Amount (KES)</th>
        </tr>
        </thead>
        <tbody>
        <% transactions.forEach((val)=>{
          %>
              <tr>
              <td><%= val.product.name %></td>
              <td><%= val.amount %></td>
              <td><%= val.commission %></td>
              </tr>
          <%
      }) %>
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
