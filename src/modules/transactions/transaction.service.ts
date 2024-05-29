/* eslint-disable import/no-cycle */
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { GetTransactionByDateDto } from './dtos/get-transaction-summary.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products';
import { Snowflake } from '@theinternetfolks/snowflake';
import { Transaction } from './schemas/transaction.schema';
import { TransactionsRepository } from './transactions.repository';
import { UsersService } from '../users';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async getTransactionByAttribute(getUserArgs: Partial<Transaction>) {
    return this.transactionsRepository.findOne(getUserArgs);
  }

  async updateTransactionByAttribute(
    transactionId: string,
    getUserArgs: Partial<Transaction>,
  ) {
    return this.transactionsRepository.findOneAndUpdate(
      { id: transactionId },
      getUserArgs,
    );
  }

  async getAllTransactionsByUser(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      'user.id': userId,
    });
  }

  async getAllTransactionsByUserAndDate(
    userId: string,
    getTransactionByDateDto: GetTransactionByDateDto,
  ): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      'user.id': userId,
      'createdAt': {
        $gte: new Date(getTransactionByDateDto.start_date).toISOString(),
        $lte: new Date(getTransactionByDateDto.end_date).toISOString(),
      },
    });
  }

  async getTransactionSummary(userId: string) {
    return this.transactionsRepository.getTransactionSummary(userId);
  }

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const id = Snowflake.generate();

    const user = await this.usersService.getUserByAttribute({ id: userId });

    if (user === null) {
      throw new NotFoundException('User with this ID does not exist.');
    }

    const product = await this.productsService.getProductByAttribute({
      id: createTransactionDto.productId,
    });

    if (product === null) {
      throw new NotFoundException('Product with this ID does not exist.');
    }

    const salesCommission = (3 / 100) * Number(product.price);

    const newTransaction = {
      id,
      currency: 'KES',
      amount: product.price,
      commission: salesCommission.toString(),
      user,
      product,
      paidStatus: 'UNPAID',
    };

    const saveedProduct =
      await this.transactionsRepository.create(newTransaction);
    return saveedProduct;
  }
}
