import { Inject, Injectable } from '@nestjs/common';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

interface RentalRow extends RowDataPacket {
  rentalId: number;
  userId: number;
  bookId: number;
  rentedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
}

@Injectable()
export class RentalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  // 대여 시각은 현재 시간, 반납 예정 시각은 현재로부터 7일 뒤로 입력합니다.
  async create(userId: number, bookId: number): Promise<RentalRow> {
    const insertSql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;

    const [result] = await this.pool.execute<ResultSetHeader>(insertSql, [
      userId,
      bookId,
    ]);

    const selectSql = `
      SELECT
        rental_id AS rentalId,
        user_id AS userId,
        book_id AS bookId,
        rented_at AS rentedAt,
        due_at AS dueAt,
        returned_at AS returnedAt
      FROM rental
      WHERE rental_id = ?
    `;

    const [rows] = await this.pool.execute<RentalRow[]>(selectSql, [
      result.insertId,
    ]);
    return rows[0];
  }
}
