import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRepository } from './book.repository.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import { Book } from './entities/book.entity.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly ormBookRepository: Repository<Book>,
    private readonly rawBookRepository: BookRepository,
  ) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.ormBookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map(BookResponseDto.from);
  }

  async getBooksByCategory(categoryId: number): Promise<any> {
    return await this.rawBookRepository.findByCategory(categoryId);
  }

  async createBook(body: Record<string, any>): Promise<string> {
    await this.rawBookRepository.create(body);
    return '도서 등록이 완료되었습니다!';
  }
}