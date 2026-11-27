import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RatingService } from './rating.service.js';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { ApiException } from '../exception/api.exception.js';

describe('RatingService', () => {
  let ratingService: RatingService;

  const ratingRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member1 = { memberId: 1, nickname: 'AA' } as Member;
  const member2 = { memberId: 2, nickname: 'BB' } as Member;
  const rating = {
    ratingId: 1,
    member: member1,
    movieId: 550,
    score: 5,
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get<RatingService>(RatingService);
  });

  it('같은 영화에 평점을 중복 등록하면 RATING409_1이 반환된다.', async () => {
    memberRepository.findOneBy.mockResolvedValue(member1);
    ratingRepository.findOne.mockResolvedValue(rating);
    await expect(
      ratingService.create(1, { movieId: 550, score: 5 }),
    ).rejects.toThrow(ApiException);
    expect(ratingRepository.create).not.toHaveBeenCalled();
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('남의 평점을 수정하려 하면 RATING403_1이 반환된다.', async () => {
    ratingRepository.findOne.mockResolvedValue(rating);
    await expect(ratingService.update(2, 1, { score: 1 })).rejects.toThrow(
      ApiException,
    );

    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
