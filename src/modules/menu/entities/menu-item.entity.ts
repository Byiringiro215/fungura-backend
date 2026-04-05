import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: 'Lunch' })
  mealTime: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  orderCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
