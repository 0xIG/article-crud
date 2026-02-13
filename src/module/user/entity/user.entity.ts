import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User entity representing application users
 * Maps to the 'user' table in the database
 */
@Entity('user')
export class User {
  /** Primary key, auto-incremented integer */
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  /** User email address, must be unique */
  @Column({
    type: 'varchar',
    unique: true,
    length: 100,
    nullable: false,
  })
  @Index('idx_user_email')
  email: string;

  /** Hashed password for authentication */
  @Column({
    name: 'hash_password',
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  hashPassword: string;

  /** User's full name */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  /** Timestamp when the user account was created */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Index('idx_user_created_at')
  createdAt: Date;

  /** Timestamp when the user account was last updated */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
