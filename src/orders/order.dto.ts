import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({ example: 'cart-uuid' })
  @IsUUID()
  cartId: string;
}
