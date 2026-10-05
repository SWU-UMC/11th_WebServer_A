import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET http://localhost:3000/books
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  // GET http://localhost:3000/books/category/1
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(categoryId);
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(
    @Body() request: CreateBookDto,
  ): Promise<BookResponseDto> {
    return await this.bookService.createBook(request);
  }
}
