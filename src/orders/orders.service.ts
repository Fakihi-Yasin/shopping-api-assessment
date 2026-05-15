import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { CheckoutDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  async checkout(dto: CheckoutDto): Promise<Order> {
    const cart = await this.cartService.getCart(dto.cartId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    const items = cart.items.map((item) =>
      this.orderItemRepo.create({
        productName: item.variant.product.name,
        variantType: item.variant.type,
        variantValue: item.variant.value,
        priceAtPurchase: item.variant.price,
        quantity: item.quantity,
      }),
    );

    const order = this.orderRepo.create({ items, total: cart.total });
    return this.orderRepo.save(order);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
