import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { JwtAuthGuard } from '../auth/guard/JWT-auth.guard';
import { ProductDto } from './dtos/product.dto';
import { ProductsService } from './product.service';
import { Request } from 'express';
import { Serialize } from '@/interceptor/serializer.interceptor';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
@Serialize(ProductDto)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProducts(
    @Req() req: Request,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getProducts(@Req() req: Request) {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductByID(@Param('id') productId, @Req() req: Request) {
    return this.productService.getProductByAttribute({ id: productId });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') productId,
    @Req() req: Request,
    @Body() updateProductDto: Partial<UpdateProductDto>,
  ) {
    return this.productService.updateProduct(productId, updateProductDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') productId, @Req() req: Request) {
    return this.productService.deleteProduct(productId);
  }
}
