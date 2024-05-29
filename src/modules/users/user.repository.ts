import { AbstractRepository } from '../database/abstract.repository';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name) orderModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(orderModel, connection);
  }
}
