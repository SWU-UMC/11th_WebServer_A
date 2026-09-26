import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable() // NestJS 컨테이너에 "나 주입 가능한 부품이야!"라고 등록
export class BookRepository {
  constructor(
    // 등록해둔 DB 커넥션 풀(DATABASE_CONNECTION)을 가져옴
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async findAll(): Promise<any> {
    const sql = 'SELECT * FROM book';

    // pool.query()는 [조회된 행들, 메타데이터 필드들] 형태의 배열을 돌려줌
    // 실제 행 데이터만 필요하므로 구조 분해 할당으로 [rows]만 꺼냄
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql =
      'INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)';

    // 두 번째 인자로 넘긴 배열이 ? 자리에 순서대로 안전하게 바인딩됨
    const [result] = await this.pool.execute(sql, [
      body.categoryId,
      body.title,
      body.description,
    ]);
    return result;
  }

  async findByCategoryId(categoryId: string | number): Promise<any> {
    const sql = 'SELECT * FROM book WHERE category_id = ?';
    const [rows] = await this.pool.execute(sql, [categoryId]);
    return rows;
  }
}
