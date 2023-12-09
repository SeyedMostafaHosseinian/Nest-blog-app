import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleResponseInterface } from './types/article-response.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {

    const newArticle = new ArticleEntity();
    if (!createArticleDto?.tags) newArticle.tagsList = [];

    Object.assign(newArticle, createArticleDto);
    newArticle.author = currentUser;
    newArticle.slug = this.createSlug(newArticle);

    return await this.articleRepository.save(newArticle);
  }

  async getAllArticles(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find({
      relations: { author: true },
    });
  }

  async getArticleBySlug(slug: string):Promise<ArticleResponseInterface> {
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) throw new NotFoundException('Article not found!');

    return this.createArticleResponse(article);
  }

  createSlug(article: ArticleEntity): string {
    return (
      article.title.replace(' ', '-') +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0)
    );
  }
  
  createArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }
}
