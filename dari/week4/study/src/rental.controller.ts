import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

interface CreateRentalBody {
  userId: number;
  bookId: number;
}

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // POST http://localhost:3000/rentals
  @Post()
  async createRental(@Body() body: CreateRentalBody): Promise<any> {
    return await this.rentalService.createRental(body.userId, body.bookId);
  }
}
