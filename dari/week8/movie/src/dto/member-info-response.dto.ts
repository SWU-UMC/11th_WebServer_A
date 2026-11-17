import { Member } from '../entity/member.entity';

export class MemberInfoResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}