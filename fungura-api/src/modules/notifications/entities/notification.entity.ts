import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  @Index()
  userId?: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  @Index()
  read: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
