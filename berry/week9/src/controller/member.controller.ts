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

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
