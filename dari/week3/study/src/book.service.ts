// src/book.service.ts
import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';

@Injectable()
export class BookService {
  // 창고지기(BookRepository)를 주입받습니다.
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<any> {
    return await this.bookRepository.findAll();
  }

  async getBooksByCategory(categoryId: number): Promise<any> {
    return await this.bookRepository.findByCategory(categoryId);
  }

  // book.service.ts에 추가
async createBook(body: Record<string, any>): Promise<string> {
  await this.bookRepository.create(body);
  return '도서 등록이 완료되었습니다!';
}
}
