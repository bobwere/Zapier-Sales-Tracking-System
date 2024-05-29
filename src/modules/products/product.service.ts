/* eslint-disable import/no-cycle */
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './schemas/product.schema';
import { ProductsRepository } from './product.repository';
import { Snowflake } from '@theinternetfolks/snowflake';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  protected readonly logger = new Logger(ProductsService.name);

  constructor(private readonly productRepository: ProductsRepository) {}

  async getProductByAttribute(getUserArgs: Partial<Product>) {
    return this.productRepository.findOne(getUserArgs);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({});
  }

  async createProduct(newProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.getProductByAttribute({
      name: newProductDto.name,
    });

    if (existingProduct) {
      this.logger.error(
        `Product with this name ${existingProduct.name} already exists`,
      );
      throw new ConflictException('Product with this name already exists');
    }

    const id = Snowflake.generate();

    const newProduct = {
      id,
      ...newProductDto,
      price: newProductDto.price.toString(),
    };

    const saveedProduct = await this.productRepository.create(newProduct);
    return saveedProduct;
  }

  async updateProduct(userID: string, updateProductDto: UpdateProductDto) {
    const updatedUser = await this.productRepository.findOneAndUpdate(
      { id: userID },
      { ...updateProductDto },
    );
    return updatedUser;
  }

  async deleteProduct(productID: string) {
    this.productRepository.delete({ id: productID });
  }
}
