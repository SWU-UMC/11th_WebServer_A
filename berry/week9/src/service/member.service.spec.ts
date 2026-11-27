import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiException } from '../exception/api.exception.js';
import { MemberService } from './member.service.js';
import { Member } from '../entity/member.entity.js';
import { ConflictException } from '@nestjs/common';

describe('MemberService', () => {
  let memberService: MemberService;

  const memberRepository = {
    exists: vi.fn(),
    findOneBy: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
    findOne: vi.fn(),
  };

  const member = {
    memberId: 1,
    nickname: '영화조아',
    email: 'challenger@umc.com',
  } as Member;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
  });

  describe('checkNickname', () => {
    it('닉네임이 사용중이라면 availalbe = false를 반환한다', async () => {
      memberRepository.exists.mockResolvedValue(member);

      const response = await memberService.checkNickname('영화조아');

      expect(response.available).toBe(false);
    });
    it('닉네임이 사용중이 아니라면 true를 반환한다', async () => {
      memberRepository.exists.mockResolvedValue(null);

      const response = await memberService.checkNickname('영화좋아');

      expect(response.available).toBe(true);
    });
  });

  describe('checkEmail', () => {
    it('이메일이 사용중이라면 available = false를 반환한다', async () => {
      memberRepository.exists.mockResolvedValue(member);

      const response = await memberService.checkEmail('challenger@umc.com');

      expect(response.available).toBe(false);
    });
    it('이메일이 사용중이 아니라면 true를 반환한다', async () => {
      memberRepository.exists.mockResolvedValue(null);

      const response = await memberService.checkEmail('example@umc.com');

      expect(response.available).toBe(true);
    });
  });

  describe('signUp', () => {
    it('사용중이 아닌 닉네임과 이메일로 회원가입할 경우, 회원가입에 성공한다', async () => {
      memberRepository.findOneBy.mockResolvedValue(null);
      memberRepository.create.mockReturnValue({
        email: 'challenger@umc.com',
        password: 'password',
        nickname: '영화조아',
      });
      memberRepository.save.mockResolvedValue({
        memberId: 1,
        email: 'challenger@umc.com',
        nickname: '영화조아',
      });

      const response = await memberService.signUp({
        email: 'challenger@umc.com',
        password: 'password',
        nickname: '영화조d아',
      });

      expect(response.memberId).toBe(1);
      expect(response.nickname).toBe('영화조아');
      expect(memberRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(memberRepository.save).toHaveBeenCalledTimes(1);
    });
    it('닉네임과 이메일이 사용중이라면 회원가입에 실패한다', async () => {
      memberRepository.findOneBy.mockResolvedValue(member);

      await expect(
        memberService.signUp({
          email: 'challenger@umc.com',
          password: 'password',
          nickname: '영화조아',
        }),
      ).rejects.toThrow(ConflictException);
      expect(memberRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getMyInfo', () => {
    it('내 정보 조회에 성공한다', async () => {
      memberRepository.findOne.mockResolvedValue(member);

      const response = await memberService.getMyInfo(1);

      expect(response.email).toBe('challenger@umc.com');
    });
    it('존재하지 않는 회원이라면 정보 조회에 실패한다', async () => {
      memberRepository.findOne.mockResolvedValue(null);

      await expect(memberService.getMyInfo(11)).rejects.toThrow(ApiException);
    });
  });

  describe('updateMyInfo', () => {
    it('내 정보 수정에 성공한다', async () => {
      memberRepository.findOne
        .mockResolvedValueOnce(member)
        .mockResolvedValueOnce(null);
      memberRepository.save.mockResolvedValue({
        email: 'challenger@umc.com',
        nickname: '닉네임바꾸기',
        createdAt: new Date('2026-09-13T21:00:00.000Z'),
      });

      const response = await memberService.updateMyInfo(1, {
        nickname: '닉네임바꾸기',
      });
      expect(response.email).toBe('challenger@umc.com');
      expect(response.nickname).toBe('닉네임바꾸기');
      expect(memberRepository.findOne).toHaveBeenCalledTimes(2);
      expect(memberRepository.save).toHaveBeenCalledTimes(1);
    });
    it('존재하지 않는 회원이라면 정보 수정에 실패한다', async () => {
      memberRepository.findOne.mockResolvedValue(null);
      await expect(
        memberService.updateMyInfo(11, { nickname: '닉네임바꾸기' }),
      ).rejects.toThrow(ApiException);
      expect(memberRepository.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepository.save).not.toHaveBeenCalled();
    });
    it('사용 중인 닉네임으로 수정할 경우 수정에 실패한다', async () => {
      memberRepository.findOne
        .mockResolvedValueOnce(member)
        .mockResolvedValueOnce(member);
      await expect(
        memberService.updateMyInfo(1, { nickname: '영화조아' }),
      ).rejects.toThrow(ApiException);
      expect(memberRepository.findOne).toHaveBeenCalledTimes(2);
      expect(memberRepository.save).not.toHaveBeenCalled();
    });
  });
});
