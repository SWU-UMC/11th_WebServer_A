import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';

@Injectable()
export class BookService {
  // BookRepository를 주입받음
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<any> {
    return await this.bookRepository.findAll();
  }

  async createBook(body: Record<string, any>): Promise<string> {
    await this.bookRepository.create(body);
    return '도서 등록이 완료되었습니다!';
  }

  async getBooksByCategory(categoryId: string): Promise<any> {
    return await this.bookRepository.findByCategoryId(categoryId);
  }
}
