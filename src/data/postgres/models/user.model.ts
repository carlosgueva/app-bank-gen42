import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.model';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
  })
  name: string;

  @Column('varchar', {
    length: 100,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    length: 20,
    nullable: false,
  })
  account_number: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
  })
  balance: number;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  status: boolean;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @OneToMany(() => Transaction, (tx) => tx.sender)
  sent: Transaction[];

  @OneToMany(() => Transaction, (tx) => tx.receiver)
  received: Transaction[];
}
