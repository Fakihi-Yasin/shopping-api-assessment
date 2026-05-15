import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @Column()
  productName!: string;

  @Column()
  variantType!: string;

  @Column()
  variantValue!: string;

  // store price as decimal with precision 10,2 to handle currencies correctly
  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase!: number;

  @Column({ type: 'int' })
  quantity!: number;
}
