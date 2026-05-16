import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async findAll(query: ProductQueryDto): Promise<{ data: Product[]; total: number; page: number; limit: number; totalPages: number }> {
    const { category, page = 1, limit = 10 } = query;
    const where = category ? { category } : {};
    const [data, total] = await this.productRepo.findAndCount({
      where,
      relations: ['variants'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id }, relations: ['variants'] });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    return this.productRepo.save(this.productRepo.create(dto));
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { variants, ...productFields } = dto;
    Object.assign(product, productFields);

    if (variants) {
          // delete old variants and replace with new one  instead of trying to diff and patch
      await this.variantRepo.delete({ product: { id } });
      product.variants = variants.map((v) => this.variantRepo.create({ ...v, product }));
    }

    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
