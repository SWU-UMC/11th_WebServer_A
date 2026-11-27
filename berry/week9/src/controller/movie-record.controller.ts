import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { MovieRecordService } from '../service/movie-record.service.js';

@ApiBearerAuth('bearerAuth')
@Controller('movie-records')
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @ApiOperation({
    summary: '트랜잭션',
    description: '즐겨찾기와 평점을 동시에 남기기',
  })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록과 평점 등록을 동시에 합니다.',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '트랜잭션 성공',
        result: {
          rating: {
            ratingId: 1,
            movieId: 550,
            score: 3,
            comment: '재밌네요',
            createdAt: '2026-09-13T21:00:00.000Z',
            updatedAt: '2026-09-13T21:00:00.000Z',
          },
          favorite: {
            favoriteId: 1,
            movieId: 550,
            createdAt: '2026-09-13T21:00:00.000Z',
          },
        },
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateMovieRecordDto) {
    const memberId = request['memberId'] as number;
    const result = await this.movieRecordService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '영화 기록을 저장했습니다.',
      result,
    };
  }
}
