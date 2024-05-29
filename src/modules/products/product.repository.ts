import { AbstractRepository } from '../database/abstract.repository';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectModel(Product.name) orderModel: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(orderModel, connection);
  }
}
