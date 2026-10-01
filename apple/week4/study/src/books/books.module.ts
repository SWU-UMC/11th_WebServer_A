import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category])],
  controllers: [BookController],
  providers: [BookService],
})
export class BooksModule {}
