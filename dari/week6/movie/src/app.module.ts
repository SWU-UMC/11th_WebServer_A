import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { MemberController } from './controller/member.controller';
import { MemberService } from './service/member.service';
import { RatingController } from './controller/rating.controller';
import { RatingService } from './service/rating.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'umc_movie'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [
    AppController,
    MemberController,
    RatingController,
  ],
  providers: [
    AppService,
    MemberService,
    RatingService,
  ],
})
export class AppModule {}