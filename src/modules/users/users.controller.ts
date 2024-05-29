import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/JWT-auth.guard';
import { Request } from 'express';
import { Serialize } from '@/interceptor/serializer.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserByID(@Req() req: Request) {
    const userId = (req.user as User).id;
    return this.usersService.getUserByAttribute({ id: userId });
  }

  @Patch()
  async updateUser(
    @Req() req: Request,
    @Body() updateNewUserDto: Partial<UpdateUserDto>,
  ) {
    const userId = (req.user as User).id;
    return this.usersService.updateUser(userId, updateNewUserDto);
  }

  @Delete()
  async deleteUser(
    @Req() req: Request,
    @Body() updateNewUserDto: Partial<UpdateUserDto>,
  ) {
    const userId = (req.user as User).id;
    return this.usersService.deleteUser(userId);
  }
}
