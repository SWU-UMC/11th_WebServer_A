import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import type { AuthenticatedRequest } from '../guard/auth.guard';
import { FavoriteService } from '../service/favorite.service';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ) {
    const result =
      await this.favoriteService.create(
        request.memberId,
        dto,
      );

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(
    @Req() request: AuthenticatedRequest,
  ) {
    const result =
      await this.favoriteService.getMyFavorites(
        request.memberId,
      );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const result =
      await this.favoriteService.getStatus(
        request.memberId,
        movieId,
      );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    await this.favoriteService.delete(
      request.memberId,
      movieId,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}