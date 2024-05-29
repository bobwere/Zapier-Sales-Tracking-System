import { CreateNewUserDto } from './create-new-user.dto';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(CreateNewUserDto, [
  'email',
  'password',
]) {}
