import { Book } from '../entities/book.entity.js';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
