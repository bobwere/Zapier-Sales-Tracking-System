import { CreateNewUserDto } from '@/modules/auth/dtos/create-new-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateNewUserDto, ['email', 'password']),
) {}
