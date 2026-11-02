import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(): Promise<any> {
    return this.bookService.getAllBooks();
  }

  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }

  @Get('category/:categoryId')
  async getBooksByCategoryId(
    @Param('categoryId') categoryId: number,
  ): Promise<any> {
    return this.bookService.getBooksByCategoryId(categoryId);
  }
}

@Controller('rentals')
export class RentalController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createRental(
    @Body('userId') userId: number,
    @Body('bookId') bookId: number,
  ): Promise<string> {
    return this.bookService.createRental(userId, bookId);
  }
}
