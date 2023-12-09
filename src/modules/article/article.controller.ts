import { ArticleService } from './article.service';
import { Controller, Get } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

}
