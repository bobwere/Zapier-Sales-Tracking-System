import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateNewUserDto } from './dtos/create-new-user.dto';
import { EmailService } from '../email/email.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { Request } from 'express';
import { Serialize } from '@/interceptor/serializer.interceptor';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('sign-up')
  async createAccount(@Body() createUserDto: CreateNewUserDto) {
    const user = await this.authService.createAccount(createUserDto);
    this.eventEmitter.emit('newuser.created', user);
    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async emailAndPasswordLogin(@Req() req: Request, @Body() _: LoginDto) {
    const user = req.user as User;
    return this.authService.login(user);
  }

  @OnEvent('newuser.created')
  handleNewUserCreatedEvent(user: User) {
    this.emailService.sendEmail({
      email: user.email,
      subject: 'Welcome To Zapier',
      data: {
        name: user.username,
        content:
          'Thank you for registering with us. Thank you for choosing Zapier Sales Tracking System as the CRM of your choice.',
        tail: 'Regards, Zapier Team',
      },
      template: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome To Zapier</title>
    </head>
    <body>
        <h4>Hi <%=name%>,</h4>
        </br>
        <p><%=content%></p>
        </br>
        </br>
        <p><%=tail%></p>
    </body>
    </html>
  `,
    });
  }
}
