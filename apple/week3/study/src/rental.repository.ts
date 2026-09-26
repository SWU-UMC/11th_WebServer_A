import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

@Injectable()
export class RentalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async create(userId: number, bookId: number): Promise<any> {
    const sql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    const [result] = await this.pool.execute(sql, [userId, bookId]);
    return result;
  }
}
