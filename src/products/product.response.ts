import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VariantResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'size' })
  type!: string;

  @ApiProperty({ example: 'XL' })
  value!: string;

  @ApiProperty({ example: 29.99 })
  price!: number;

  @ApiProperty({ example: 100 })
  stock!: number;
}

export class ProductResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'T-Shirt' })
  name!: string;

  @ApiPropertyOptional({ example: 'A comfortable cotton t-shirt' })
  description!: string;

  @ApiProperty({ example: 'clothing' })
  category!: string;

  @ApiProperty({ type: [VariantResponse] })
  variants!: VariantResponse[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
