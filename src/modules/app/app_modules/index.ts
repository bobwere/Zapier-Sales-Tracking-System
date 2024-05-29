import { AppConfig } from '../app.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/modules/database/database.module';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { EmailModule } from '@/modules/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { ProductModule } from '@/modules/products';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from '@/modules/task/task.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from '@/modules/transactions';
import { UsersModule } from '@/modules/users';

export const appModules: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
  // Allow to access .env file and validate env variables
  ConfigModule.forRoot(AppConfig.getInitConifg()),
  // Import mongodb
  DatabaseModule,
  // Logger framework that better then NestJS default logger
  LoggerModule.forRoot(AppConfig.getLoggerConfig()),
  // Throttler config
  ThrottlerModule.forRoot(AppConfig.getThrottlerConifg()),
  // EventEmitter Module
  EventEmitterModule.forRoot({
    wildcard: true,
    delimiter: '.',
  }),
  // Schdeluer Module
  ScheduleModule.forRoot(),
  UsersModule,
  AuthModule,
  EmailModule,
  ProductModule,
  TransactionModule,
  TaskModule,
];
