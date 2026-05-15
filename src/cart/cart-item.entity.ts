import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../products/product-variant.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart!: Cart;

  @ManyToOne(() => ProductVariant, { eager: true, onDelete: 'CASCADE' })
  variant!: ProductVariant;

  @Column({ type: 'int' })
  quantity!: number;
}
