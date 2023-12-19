import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  tagsList?:string[]
}
