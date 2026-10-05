// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.provider.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { RentalController } from './rental.controller.js';
import { RentalService } from './rental.service.js';
import { RentalRepository } from './rental.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Book } from './entities/book.entity.js';
import { Category } from './entities/category.entity.js';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: Number(configService.get<string>('DB_PORT', '3306')),
      username: configService.get<string>('DB_USER', 'root'),
      password: configService.get<string>('DB_PASSWORD', ''),
      database: configService.get<string>('DB_NAME', 'study'),
      autoLoadEntities: true,
      synchronize: false,
    }),
  }),
  TypeOrmModule.forFeature([Book, Category]),
],
  controllers: [
    AppController,
    BookController, // 추가!
    RentalController,
  ],
  providers: [
    ...databaseProviders,
    AppService,
    BookService, // 추가!
    BookRepository, // 추가
    RentalService,
    RentalRepository,
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
