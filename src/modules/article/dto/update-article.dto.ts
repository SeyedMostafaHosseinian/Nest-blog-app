import { IsNotEmpty } from 'class-validator';
export class UpdateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  description: string;
}
