import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { ProductVariant } from '../products/product-variant.entity';
import { AddCartItemDto, UpdateCartItemDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async createCart(): Promise<Cart> {
    return this.cartRepo.save(this.cartRepo.create());
  }

  async getCart(cartId: string): Promise<Cart & { total: number }> {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });
    if (!cart) throw new NotFoundException(`Cart ${cartId} not found`);
    const total = cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
    return { ...cart, total: Number(total.toFixed(2)) };
  }

  async addItem(cartId: string, dto: AddCartItemDto): Promise<Cart & { total: number }> {
    const cart = await this.cartRepo.findOne({ where: { id: cartId }, relations: ['items', 'items.variant'] });
    if (!cart) throw new NotFoundException(`Cart ${cartId} not found`);

    const variant = await this.variantRepo.findOne({ where: { id: dto.variantId } });
    if (!variant) throw new NotFoundException(`Variant ${dto.variantId} not found`);

    const existing = cart.items.find((i) => i.variant.id === dto.variantId);
    if (existing) {
      existing.quantity += dto.quantity;
      await this.cartItemRepo.save(existing);
    } else {
      await this.cartItemRepo.save(this.cartItemRepo.create({ cart, variant, quantity: dto.quantity }));
    }

    return this.getCart(cartId);
  }

  async updateItem(cartId: string, itemId: string, dto: UpdateCartItemDto): Promise<Cart & { total: number }> {
    const item = await this.cartItemRepo.findOne({ where: { id: itemId, cart: { id: cartId } } });
    if (!item) throw new NotFoundException(`Cart item ${itemId} not found`);
    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);
    return this.getCart(cartId);
  }

  async removeItem(cartId: string, itemId: string): Promise<Cart & { total: number }> {
    const item = await this.cartItemRepo.findOne({ where: { id: itemId, cart: { id: cartId } } });
    if (!item) throw new NotFoundException(`Cart item ${itemId} not found`);
    await this.cartItemRepo.remove(item);
    return this.getCart(cartId);
  }
}
