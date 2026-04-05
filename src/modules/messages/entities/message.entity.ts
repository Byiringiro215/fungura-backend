import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  senderId: string;

  @Column()
  @Index()
  receiverId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
