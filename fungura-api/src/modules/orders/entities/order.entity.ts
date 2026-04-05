import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany, ManyToOne, Index,
} from 'typeorm';

export enum OrderStatus {
  ON_PROCESS = 'On Process',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum OrderType {
  DINE_IN = 'Dine-In',
  TAKEAWAY = 'Takeaway',
  DELIVERY = 'Delivery',
}

export enum KitchenStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  orderNumber: string;

  @Column()
  customer: string;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ON_PROCESS })
  @Index()
  status: OrderStatus;

  @Column({ type: 'enum', enum: KitchenStatus, default: KitchenStatus.PENDING })
  kitchenStatus: KitchenStatus;

  @Column({ nullable: true })
  tableNumber: string;

  @Column({ default: '-' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ default: 0 })
  totalQty: number;

  @Column({ default: 'normal' })
  priority: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  driverName: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  name: string;

  @Column({ default: 1 })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  notes: string;
}
