import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user';

/**
 * Article entity representing blog articles in the system
 * Maps to the 'article' table in the database
 */
@Entity('article')
export class Article {
  /** Primary key, auto-incremented integer */
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  /** Article title, must be unique */
  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  title: string;

  /** Short description/summary of the article */
  @Column({
    name: 'description',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  description: string;

  /** Full content of the article in text format */
  @Column({ name: 'content', type: 'text', nullable: false })
  content: string;

  /** Author of the article (foreign key to User entity) */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  /** Timestamp when the article was created */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  /** Timestamp when the article was last updated */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
