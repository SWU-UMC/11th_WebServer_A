import { Controller, Body, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals') // 기본 주소: /rentals
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // 신규 도서 대여 기록 생성
  @Post()
  async createRental(@Body() body: Record<string, any>): Promise<string> {
    return await this.rentalService.createRental(body);
  }
}
