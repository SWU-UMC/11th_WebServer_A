import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import type { Request } from 'express';
import { MemberService } from '../service/member.service.js';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({
    summary: '닉네임 중복 조회',
    description:
      '닉네임이 이미 사용 중인지 확인합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 중복 조회 성공',
    schema: {
      example: {
        available: false,
      },
    },
  })
  @Get('nickname/:nickname')
  async checkNickname(@Param('nickname') nickname: string) {
    const result = await this.memberService.checkNickname(nickname);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '닉네임 중복 여부를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '이메일 중복 조회',
    description:
      '이메일이 이미 사용 중인지 확인합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '이메일 중복 조회 성공',
    schema: {
      example: {
        available: false,
      },
    },
  })
  @Get('email/:email')
  async checkEmail(@Param('email') email: string) {
    const result = await this.memberService.checkEmail(email);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '이메일 중복 여부를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '회원가입',
    description:
      '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '토큰의 주인인 회원이 본인의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 조회했습니다.',
        result: {
          email: 'challenger@umc.com',
          nickname: '영화조아',
          createdAt: '2026-09-13T21:00:00.000Z',
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
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: Request) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '내 정보 수정',
    description: '토큰의 주인인 회원이 본인 정보를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 수정 성공',
    schema: {
      example: {
        isSuccess: true,
        code: 'COMMON200',
        message: '회원 정보를 수정했습니다.',
        result: {
          email: 'challenger@umc.com',
          nickname: '영화젤루조아',
          createdAt: '2026-09-13T21:00:00.000Z',
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
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: Request,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}
