import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.provider.js';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController, RentalController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // 환경 변수를 애플리케이션 전역에서 사용 가능하도록 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.getOrThrow('DB_HOST'),
        port: ConfigService.getOrThrow('DB_PORT'),
        username: ConfigService.getOrThrow('DB_USER'),
        password: ConfigService.getOrThrow('DB_PASSWORD'),
        database: ConfigService.getOrThrow('DB_NAME'),
        entities: [Book, Category],
      }),
    }),
    TypeOrmModule.forFeature([Book, Category]),
  ],
  controllers: [AppController, BookController, RentalController],
  providers: [...databaseProviders, AppService, BookService, BookRepository],
  exports: [...databaseProviders],
})
export class AppModule {}
