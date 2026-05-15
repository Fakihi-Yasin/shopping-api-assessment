import { ApiProperty } from '@nestjs/swagger';
import { VariantResponse } from '../products/product.response';

export class CartItemResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ type: VariantResponse })
  variant!: VariantResponse;

  @ApiProperty({ example: 2 })
  quantity!: number;
}

export class CartResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ type: [CartItemResponse] })
  items!: CartItemResponse[];

  @ApiProperty({ example: 59.98 })
  total!: number;

  @ApiProperty()
  createdAt!: Date;
}
