import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum WorkerRole {
  KITCHEN = 'Kitchen',
  WAITER = 'Waiter',
  DELIVERY = 'Delivery',
  MANAGER = 'Manager',
}

export enum WorkerStatus {
  ACTIVE = 'Active',
  ON_DUTY = 'On-duty',
  OFFLINE = 'Offline',
}

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: WorkerRole })
  @Index()
  role: WorkerRole;

  @Column({ type: 'enum', enum: WorkerStatus, default: WorkerStatus.OFFLINE })
  status: WorkerStatus;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  joinedDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
