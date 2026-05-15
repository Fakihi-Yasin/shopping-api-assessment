import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: 'size' })
  @IsString() @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'XL' })
  @IsString() @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber() @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional() @IsNumber() @Min(0)
  stock?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'T-Shirt' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'A comfortable cotton t-shirt' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ example: 'clothing' })
  @IsString() @IsNotEmpty()
  category: string;

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
