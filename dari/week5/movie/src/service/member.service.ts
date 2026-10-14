import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckResponseDto } from '../dto/check-response.dto';
import { Member } from '../entity/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { nickname },
    });

    return {
      available: !exists,
    };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
  const exists = await this.memberRepository.exists({
    where: { email },
  });

  return {
    available: !exists,
  };
}
}