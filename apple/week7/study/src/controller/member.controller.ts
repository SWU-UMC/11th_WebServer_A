import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberService } from "../service/member.service.js";
import type { Request } from 'express'; // 데코레이터 시그니처에 쓰는 타입은 import type 이어야 함
import { AuthGuard } from '../guard/auth.guard.js';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto.js';

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "회원가입에 성공했습니다.",
      result,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard) // 이 줄이 없으면 토큰 없이도 호출됨
  async getMyInfo(@Req() request: Request) {
    // Guard가 request["memberId"]에 담아둔 값을 꺼냄
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }
}
