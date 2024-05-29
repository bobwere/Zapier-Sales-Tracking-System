/* eslint-disable import/no-cycle */
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateNewUserDto } from '../auth/dtos/create-new-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Snowflake } from '@theinternetfolks/snowflake';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUserByAttribute(getUserArgs: Partial<User>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createNewUser(newUserData: CreateNewUserDto): Promise<User> {
    const exsitingUser = await this.getUserByAttribute({
      email: newUserData.email,
    });

    if (exsitingUser) {
      throw new ConflictException(
        'The email provided is already in use. Please use another email.',
      );
    }

    const id = Snowflake.generate();

    const newUser = {
      id,
      ...newUserData,
    };

    const saveedUser = await this.usersRepository.create(newUser);
    return saveedUser;
  }

  async updateUser(userID: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { id: userID },
      { ...updateUserDto },
    );
    return updatedUser;
  }

  async deleteUser(userID: string) {
    this.usersRepository.delete({ id: userID });
  }
}
