import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Member } from '../entity/member.entity';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { email: dto.email },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const isPasswordMatched = await bcrypt.compare(
      dto.password,
      member.password,
    );

    if (!isPasswordMatched) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'AUTH401_1',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    return {
      nickname: member.nickname,
      accessToken,
    };
  }
}