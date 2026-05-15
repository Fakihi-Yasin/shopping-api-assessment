import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'T-Shirt' })
  productName!: string;

  @ApiProperty({ example: 'size' })
  variantType!: string;

  @ApiProperty({ example: 'XL' })
  variantValue!: string;

  @ApiProperty({ example: 29.99 })
  priceAtPurchase!: number;

  @ApiProperty({ example: 2 })
  quantity!: number;
}

export class OrderResponse {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ type: [OrderItemResponse] })
  items!: OrderItemResponse[];

  @ApiProperty({ example: 59.98 })
  total!: number;

  @ApiProperty()
  createdAt!: Date;
}
