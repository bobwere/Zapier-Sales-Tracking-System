import { AppConfig } from '@mod/app';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { MailgunModule } from 'nestjs-mailgun';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // MailgunConfig
    MailgunModule.forAsyncRoot({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        AppConfig.getMailgunConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
