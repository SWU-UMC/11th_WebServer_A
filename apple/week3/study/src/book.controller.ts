import { Controller, Body, Param, Get, Post } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // BookService)을 주입 받음
  constructor(private readonly bookService: BookService) {}

  // 도서 전체 목록 조회
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // 신규 도서 등록
  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }

  // 특정 카테고리 도서 목록 조회
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(categoryId);
  }
}
