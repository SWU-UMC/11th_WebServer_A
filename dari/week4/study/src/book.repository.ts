// src/book.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable() // NestJS 컨테이너에 "나 주입 가능한 부품이야!"라고 등록
export class BookRepository {
  constructor(
    // 2단계에서 우리가 등록해둔 DB 커넥션 풀(DATABASE_CONNECTION)을 가져옵니다.
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async findAll(): Promise<any> {
    const sql = 'SELECT * FROM book';
    
    // pool.query()는 [조회된 행들, 메타데이터 필드들] 형태의 배열을 돌려줍니다.
    // 우리는 실제 행 데이터만 필요하므로 구조 분해 할당으로 [rows]만 쏙 꺼냅니다.
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  // category_id가 일치하는 도서만 조회합니다.
  async findByCategory(categoryId: number): Promise<any> {
    const sql = `
      SELECT book_id, category_id, title, description, is_available
      FROM book
      WHERE category_id = ?
    `;

    const [rows] = await this.pool.execute(sql, [categoryId]);
    return rows;
  }

  async create(body: Record<string, any>): Promise<any> {
  const sql = 'INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)';

  // 두 번째 인자로 넘긴 배열이 ? 자리에 순서대로 안전하게 바인딩됩니다.
  const [result] = await this.pool.execute(sql, [
    body.categoryId,
    body.title,
    body.description,
  ]);
  return result;
}
}
