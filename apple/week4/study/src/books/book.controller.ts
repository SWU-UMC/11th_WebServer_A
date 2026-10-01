import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET /books - 도서 전체 목록 조회
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getBooks();
  }

  // POST /books - 신규 도서 등록
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(createBookDto);
  }
}
