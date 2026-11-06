import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';
import { CreateBookDto, BookResponseDto } from './dtos/book.request.dto.js';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly books: Repository<Book>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    private readonly bookRepository: BookRepository,
  ) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.books.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });

    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(createBookDto: CreateBookDto) {
    const { categoryId, title, description } = createBookDto;

    const category = await this.categories.findOne({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = this.books.create({
      title,
      description: description ?? null,
      category,
      isAvailable: true,
    });

    const savedBook = await this.books.save(book);
    return BookResponseDto.from(savedBook);
  }

  async getBooksByCategoryId(categoryId: number): Promise<any> {
    const category = await this.categories.findOne({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
    return this.bookRepository.findBooksByCategoryId(categoryId);
  }

  async createRental(userId: number, bookId: number): Promise<string> {
    await this.bookRepository.createRental(userId, bookId);
    return '대여가 완료되었습니다!';
  }
}
