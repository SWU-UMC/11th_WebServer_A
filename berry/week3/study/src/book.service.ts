import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<any> {
    return this.bookRepository.findAll();
  }

  async createBook(body: Record<string, any>): Promise<string> {
    await this.bookRepository.create(body);
    return '도서 등록이 완료되었습니다!';
  }

  async getBooksByCategoryId(categoryId: number): Promise<any> {
    return this.bookRepository.findBooksByCategoryId(categoryId);
  }

  async createRental(userId: number, bookId: number): Promise<string> {
    await this.bookRepository.createRental(userId, bookId);
    return '대여가 완료되었습니다!';
  }
}
