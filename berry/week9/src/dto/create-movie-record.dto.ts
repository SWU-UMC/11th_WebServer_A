import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieRecordDto {
  @ApiProperty({ description: 'TMDB 영화 ID', example: 550 })
  @IsNotEmpty({ message: '영화 ID는 필수입니다.' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;

  @ApiProperty({ description: '영화 별점', example: 5 })
  @IsNotEmpty({ message: '별점은 필수입니다.' })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @ApiProperty({ description: '영화 평점', example: '재미있어요' })
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: '해당 영화 즐겨찾기 여부', example: true })
  @IsBoolean({ message: '즐겨찾기 추가 여부는 true 또는 false여야 합니다.' })
  addToFavorites: boolean;
}
