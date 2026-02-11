import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    length: 100,
    nullable: false,
  })
  @Index()
  email: string;

  @Column({
    name: 'hash_password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false, // Don't select password by default
  })
  hashPassword: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
