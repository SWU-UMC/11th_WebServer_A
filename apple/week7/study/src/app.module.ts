import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./entity/member.entity.js";
import { Rating } from "./entity/rating.entity.js";
import { AuthController } from "./controller/auth.controller.js";
import { MemberController } from "./controller/member.controller.js";
import { RatingController } from "./controller/rating.controller.js";
import { AuthService } from "./service/auth.service.js";
import { MemberService } from "./service/member.service.js";
import { RatingService } from "./service/rating.service.js";
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.registerAsync({
      global: true, // 전역 등록해두면 어느 서비스에서든 JwtService를 주입받을 수 있음
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // 초 단위 숫자로 넘김. 환경변수는 문자열로 들어오므로 Number()로 바꿔줌
          expiresIn: Number(configService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600),
        },
      }),
    }),
  ],
  controllers: [AuthController, MemberController, RatingController],
  providers: [AuthService, MemberService, RatingService],
})
export class AppModule {}
