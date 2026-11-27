import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { Rating } from '../src/entity/rating.entity.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';
import { Member } from '../src/entity/member.entity.js';
import { RatingController } from '../src/controller/rating.controller.js';
import { RatingService } from '../src/service/rating.service.js';

describe('평점 API (통합 테스트)', () => {
  let app: INestApplication;
  let ratingRepository: Repository<Rating>;
  let memberRepository: Repository<Member>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Rating, Member],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Rating, Member]),
        JwtModule.register({
          global: true,
          secret: 'test-secret-for-e2e-only',
          signOptions: { expiresIn: 3600 },
        }),
      ],
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    ratingRepository = moduleFixture.get(getRepositoryToken(Rating));
    memberRepository = moduleFixture.get(getRepositoryToken(Member));

    member = await memberRepository.save(
      memberRepository.create({
        email: 'challenger@umc.com',
        password: 'saoifwehofewqg',
        nickname: '영화조아',
      }),
    );

    const jwtService = moduleFixture.get(JwtService);
    const token = jwtService.sign({
      sub: String(member.memberId),
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  beforeEach(async () => {
    await ratingRepository.clear();
  });

  it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답한다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/members/550/ratings')
      .send({
        movieId: 550,
        score: 4,
      })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');
  });
  it('토큰을 담아 평점을 등록하면 201과 저장된 평점 ID를 응답한다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/members/550/ratings')
      .set('Authorization', authorization)
      .send({
        movieId: 550,
        score: 4,
      })
      .expect(201);

    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
  });
});
