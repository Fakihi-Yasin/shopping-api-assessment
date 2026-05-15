import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ example: 'variant-uuid' })
  @IsUUID()
  variantId: string;

  @ApiProperty({ example: 2 })
  @IsInt() @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 3 })
  @IsInt() @Min(1)
  quantity: number;
}
