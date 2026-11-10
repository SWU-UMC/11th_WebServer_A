import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { AuthGuard } from '../guard/auth.guard';
import type { AuthenticatedRequest } from '../guard/auth.guard';
import { MemberService } from '../service/member.service';

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(
    @Req() request: AuthenticatedRequest,
  ) {
    const result = await this.memberService.getMyInfo(
      request.memberId,
    );

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
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const result = await this.memberService.updateMyInfo(
      request.memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }

  @Get('nickname/:nickname')
  checkNickname(
    @Param('nickname') nickname: string,
  ): Promise<CheckResponseDto> {
    return this.memberService.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(
    @Param('email') email: string,
  ): Promise<CheckResponseDto> {
    return this.memberService.checkEmail(email);
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
}