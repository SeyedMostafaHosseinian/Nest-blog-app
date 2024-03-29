import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetAllArticlesDto {
  @Transform((param) => +param.value)
  @IsNumber()
  @IsOptional()
  readonly page: number;

  @IsOptional()
  readonly author: string;

  @IsOptional()
  readonly tag: string;

  @IsOptional()
  @IsEnum({ old: 'oldest', new: 'newest' })
  readonly orderByCreation: 'oldest' | 'newest';

  @IsOptional()
  @IsBoolean()
  readonly justFavored: string
}
