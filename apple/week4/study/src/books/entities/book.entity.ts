import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity('book')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Category, (category) => category.books, {
    nullable: false,
  })
  
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
