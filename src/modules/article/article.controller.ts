import { AuthGuard } from 'src/guards/auth.guard';
import { ArticleService } from './article.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/article-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /** create article */
  @Post()
  @UseGuards(AuthGuard)
  createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    return this.articleService.createArticle(currentUser, createArticleDto);
  }

  /** get all article */
  @Get()
  getAllArticles(): Promise<ArticleEntity[]> {
    return this.articleService.getAllArticles();
  }

  /** get single article by slug */
  @Get(':slug')
  getArticleBySlug(@Param('slug') slug:string): Promise<ArticleResponseInterface> {
    return this.articleService.getArticleBySlug(slug);
  }

}
