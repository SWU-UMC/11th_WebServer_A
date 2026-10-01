import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { BookResponseDto } from './dto/book-response.dto.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 1. 도서 전체 목록 조회
  async getBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }

  // 2. 신규 도서 등록
  async createBook(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    const { categoryId, title, description } = createBookDto;

    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    const book = this.bookRepository.create({
      title,
      description,
      category,
    });

    const savedBook = await this.bookRepository.save(book);

    return BookResponseDto.from(savedBook);
  }
}
