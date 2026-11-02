import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable() // NestJS 컨테이너에 "나 주입 가능한 부품이야!"라고 등록
export class BookRepository {
  constructor(
    // 우리가 등록해둔 DB 커넥션 풀(DATABASE_CONNECTION)을 가져옴
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async findAll(): Promise<any> {
    const sql = 'SELECT * FROM book';
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql =
      'INSERT INTO book (category_id, title, description, is_available) VALUES (?,?,?,true)';

    const [result] = await this.pool.execute(sql, [
      body.categoryId,
      body.title,
      body.description,
    ]);
    return result;
  }

  async findBooksByCategoryId(categoryId: number): Promise<any> {
    const sql = 'SELECT * FROM book WHERE category_id = ?';
    const [rows] = await this.pool.execute(sql, [categoryId]);
    return rows;
  }

  async createRental(userId: number, bookId: number): Promise<any> {
    const sql =
      'INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))';
    const [result] = await this.pool.execute(sql, [userId, bookId]);
    return result;
  }
}
