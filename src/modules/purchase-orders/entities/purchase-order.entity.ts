import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  orderNumber: string;

  @Column()
  item: string;

  @Column()
  itemCategory: string;

  @Column()
  vendor: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column()
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'Pending' })
  @Index()
  status: string;

  @Column({ default: 0 })
  deliveryProgress: number;

  @Column({ nullable: true })
  arrivalDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
