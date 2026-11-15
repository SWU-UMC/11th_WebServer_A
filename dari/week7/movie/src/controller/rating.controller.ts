import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { AuthGuard } from '../guard/auth.guard';
import type { AuthenticatedRequest } from '../guard/auth.guard';
import { RatingService } from '../service/rating.service';

@Controller()
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
  ) {}

  // 기존 공개 조회 API는 유지합니다.
  @Get('members/:memberId/ratings')
  getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRatingDto,
  ) {
    const result = await this.ratingService.create(
      request.memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    await this.ratingService.update(
      request.memberId,
      ratingId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 수정에 성공했습니다.',
      result: null,
    };
  }

  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    await this.ratingService.delete(
      request.memberId,
      ratingId,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 삭제에 성공했습니다.',
      result: null,
    };
  }
}