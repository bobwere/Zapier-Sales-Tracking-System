import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTransactionByDateDto {
  @ApiProperty()
  @IsOptional()
  start_date?: string;

  @ApiProperty()
  @IsOptional()
  end_date?: string;
}

export class GenerateReportTransactionReportDateDto {
  @ApiProperty()
  @IsString()
  start_date: string;

  @ApiProperty()
  @IsString()
  end_date: string;

  @ApiProperty()
  @IsString()
  email: string;
}
