import { CreateProductDto } from './create-product.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['name']),
) {}
