import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  productId: string;
}
