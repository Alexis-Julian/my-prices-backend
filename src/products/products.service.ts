import { Injectable } from '@nestjs/common';
import { GET_PRODUCT_CARREFOUR, GET_PRODUCT_COTO } from 'src/libs/puppeteer';

@Injectable()
export class ProductsService {
  /* create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  } */

  async findAll() {
    return 2;
  }

  async findOne(product: string) {
    const products = await GET_PRODUCT_CARREFOUR(product);

    return products;
  }

  /* update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  } */

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
