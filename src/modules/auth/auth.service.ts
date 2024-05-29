import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateNewUserDto } from './dtos/create-new-user.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<User> | null {
    const user = await this.usersService.getUserByAttribute({ email });

    if (user === null) {
      throw new BadRequestException(
        'The email address you have entered does not correspond to a registered user.',
      );
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid === false) {
      throw new BadRequestException('Password is incorrect');
    }

    return passwordIsValid ? user : null;
  }

  async createAccount(createUserDto: CreateNewUserDto): Promise<User> {
    const saltOrRounds = 10;

    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const userSaving = {
      ...createUserDto,
      password: hash,
    };

    const saveduser = await this.usersService.createNewUser(userSaving);

    return saveduser;
  }

  async login(user: Partial<User>): Promise<any> {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      ...user,
      access_token: token,
    };
  }
}
