import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';
import { CartResponse } from './cart.response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({ status: 201, type: CartResponse })
  createCart() {
    return this.cartService.createCart();
  }

  @Get(':cartId')
  @ApiOperation({ summary: 'Get cart with items and total' })
  @ApiResponse({ status: 200, type: CartResponse })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({ status: 201, type: CartResponse })
  @ApiResponse({ status: 404, description: 'Cart or variant not found' })
  addItem(@Param('cartId') cartId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(cartId, dto);
  }

  @Patch(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ status: 200, type: CartResponse })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  updateItem(@Param('cartId') cartId: string, @Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(cartId, itemId, dto);
  }

  @Delete(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({ status: 200, type: CartResponse })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeItem(@Param('cartId') cartId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(cartId, itemId);
  }
}
