import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleResponseInterface } from './types/article-response.interface';

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

  /** @todo: we should'nt display password in the following query result */
  async getAllArticles(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find();
  }

  /** @todo: we should'nt display password in the following query result */
  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) throw new NotFoundException('Article not found!');
    return article;
  }

  async deleteArticle(
    slug: string,
    currentUserId: string,
  ): Promise<DeleteResult> {
    const article = await this.getArticleBySlug(slug);

    if (!article) throw new NotFoundException('Article not found');

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException(
        'just Author of this article can delete this article',
      );
    }
    return await this.articleRepository.delete({ slug: article.slug });
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
