import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ArticleService } from './article.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleResponseInterface } from './types/article-response.interface';
import { DeleteResult } from 'typeorm';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /** create article */
  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.createArticleResponse(article);
  }

  /** like article */
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeArticle(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.likeAndFavoriteArticle(
      currentUserId,
      slug,
    );
    return this.articleService.createArticleResponse(article);
  }

  /** dislike article */
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async dislikeArticle(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.dislikeAndRemoveFavoriteArticle(
      currentUserId,
      slug,
    );
    return this.articleService.createArticleResponse(article);
  }

  /** get all article */
  @Get()
  getAllArticles(
    @Query()
    getAllArticlesQuery: GetAllArticlesDto,
    @User('id')
    currentUserId,
  ): Promise<ArticleEntity[]> {
    return this.articleService.getAllArticles(
      getAllArticlesQuery,
      currentUserId,
    );
  }

  /** get single article by slug */
  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.createArticleResponse(article);
  }

  /** delete article */
  @Delete(':slug')
  @UseGuards(AuthGuard)
  deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @User() currentUser: UserEntity,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUser,
    );
    return this.articleService.createArticleResponse(article);
  }
}
