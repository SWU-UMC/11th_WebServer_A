import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto, CreateBookDto } from './dtos/book.request.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getBooks(): Promise<any> {
    return this.bookService.getAllBooks();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.createBook(createBookDto);
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
