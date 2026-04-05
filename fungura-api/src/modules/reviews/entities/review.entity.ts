import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  menuItemName: string;

  @Column()
  @Index()
  category: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  overallRating: number;

  @Column({ type: 'text' })
  text: string;

  @Column()
  author: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
