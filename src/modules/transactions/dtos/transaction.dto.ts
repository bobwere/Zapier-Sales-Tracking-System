import { Expose, Type } from 'class-transformer';
import { ProductDto } from '@/modules/products/dtos/product.dto';
import { UserDto } from '@/modules/users/dtos/user.dto';

export class TransactionDto {
  @Expose()
  id: string;

  @Expose()
  amount: string;

  @Expose()
  commission: string;

  @Expose()
  currency: string;

  @Expose()
  paidStatus: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  total_sales_amount: number;

  @Expose()
  total_commission_amount: number;
}
