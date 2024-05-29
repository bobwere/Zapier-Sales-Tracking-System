/* eslint-disable import/no-cycle */
import { EmailModule } from '../email/email.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '../products';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { TransactionsRepository } from './transactions.repository';
import { UsersModule } from '../users';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionService, TransactionsRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
