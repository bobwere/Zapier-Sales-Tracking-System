import { AbstractRepository } from '../database/abstract.repository';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsRepository extends AbstractRepository<Transaction> {
  protected readonly logger = new Logger(TransactionsRepository.name);

  constructor(
    @InjectModel(Transaction.name) transactionModel: Model<Transaction>,
    @InjectConnection() connection: Connection,
  ) {
    super(transactionModel, connection);
  }

  async getTransactionSummary(userId: string) {
    const result = await this.model.aggregate([
      {
        $match: {
          'user.id': userId,
          'paidStatus': 'UNPAID',
        },
      },
      {
        $group: {
          _id: null,
          total_sales_amount: { $sum: { $toInt: '$amount' } },
          total_commission_amount: { $sum: { $toInt: '$commission' } },
        },
      },
    ]);

    return result;
  }
}
