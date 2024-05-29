import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PAIDSTATUS } from '@/shared/enums/enums';

export class UpdateTransactionDto {
  @ApiProperty()
  @IsEnum(PAIDSTATUS)
  paidStatus: PAIDSTATUS;
}
