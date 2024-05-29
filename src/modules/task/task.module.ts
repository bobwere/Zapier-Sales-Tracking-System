import { EmailModule } from '../email/email.module';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TransactionModule } from '../transactions';
import { UsersModule } from '../users';

@Module({
  imports: [EmailModule, TransactionModule, UsersModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
