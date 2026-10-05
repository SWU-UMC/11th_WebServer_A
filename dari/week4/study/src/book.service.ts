import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRepository } from './book.repository.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class BookService {
  constructor(
  @InjectRepository(Book)
    private readonly ormBookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

  async createBook(request: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: {
        categoryId: request.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = this.ormBookRepository.create({
      category,
      title: request.title,
      description: request.description ?? null,
      isAvailable: true,
    });

    const savedBook = await this.ormBookRepository.save(book);

    return BookResponseDto.from(savedBook);
  }
}