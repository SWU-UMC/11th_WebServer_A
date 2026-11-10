import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberService } from '../service/member.service';
import {
  AuthGuard,
  type AuthenticatedRequest,
} from '../guard/auth.guard';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('me')
@UseGuards(AuthGuard)
async getMyInfo(@Req() request: AuthenticatedRequest) {
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

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
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