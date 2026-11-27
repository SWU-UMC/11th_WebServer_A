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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';
import { RatingService } from '../service/rating.service.js';
import { AuthGuard } from '../guard/auth.guard.js';

@ApiTags('평점')
@Controller('members/:memberId/ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiOperation({
    summary: '회원의 평점 조회',
    description: '해당 회원의 평점을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원의 평점 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '내 평점 목록을 조회했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 3,
          comment: '재밌네요',
          createdAt: '2026-09-13T21:00:00.000Z',
          updatedAt: '2026-09-13T21:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 회원',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER404_1',
        message: '해당 회원을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @Get()
  async getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    const result = await this.ratingService.getRatingsByMember(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 평점 목록을 조회했습니다.',
      result,
    };
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '평점 등록',
    description:
      '토큰의 주인인 회원이 영화 ID와 점수, 내용으로 평점을 남길 수 있습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '평점 등록 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON201',
        message: '평점 등록에 성공했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 3,
          comment: '재밌네요',
          createdAt: '2026-09-13T21:00:00.000Z',
          updatedAt: '2026-09-13T21:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 회원',
    schema: {
      example: {
        isSuccess: false,
        code: 'MEMBER404_1',
        message: '해당 회원을 찾을 수 없습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '이미 평점을 남긴 영화',
    schema: {
      example: {
        isSuccess: false,
        code: 'RATING409_1',
        message: '이미 이 영화에 평점을 남기셨습니다.',
        result: null,
      },
    },
  })
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateRatingDto) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점 등록에 성공했습니다.',
      result,
    };
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '평점 수정',
    description:
      '토큰의 주인인 회원이 본인이 작성했던 평점을 수정할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '평점 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점 수정에 성공했습니다.',
        result: {
          ratingId: 1,
          movieId: 550,
          score: 1,
          comment: '재미없어요',
          createdAt: '2026-09-13T21:00:00.000Z',
          updatedAt: '2026-09-13T21:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @Patch(':ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 수정에 성공했습니다.',
      result,
    };
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '평점 삭제',
    description:
      '토큰의 주인인 회원이 본인이 등록한 평점을 삭제할 수 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '평점 삭제 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '평점을 삭제했습니다.',
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 없거나 유효하지 않음',
    schema: {
      example: {
        isSuccess: false,
        code: 'AUTH401_2',
        message: '로그인이 필요한 요청입니다.',
        result: null,
      },
    },
  })
  @Delete(':ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.ratingService.delete(memberId, ratingId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
