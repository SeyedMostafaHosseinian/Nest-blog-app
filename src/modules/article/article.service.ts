import { ArticleController } from './article.controller';
import {
  ConflictException,
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
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();
    if (!createArticleDto?.tags) newArticle.tagsList = [];
    newArticle.tagsList = createArticleDto.tags;
    Object.assign(newArticle, createArticleDto);
    newArticle.author = currentUser;
    newArticle.slug = this.createSlug(newArticle);

    return await this.articleRepository.save(newArticle);
  }

  async likeAndFavoriteArticle(
    currentUserId: string,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) throw new NotFoundException('Article Not found!');

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: { favortiedArticles: true },
    });
    if (!user) throw new NotFoundException('User Not found!');

    const isNotFavorited =
      user.favortiedArticles.findIndex(
        (favoritedArticle) => favoritedArticle.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favortiedArticles.push(article);
      article.likesCount++;
      await this.articleRepository.save(article);
      await this.userRepository.save(user);
    } else {
      throw new ConflictException('this article is liked by this user!');
    }

    return article;
  }

  async dislikeAndRemoveFavoriteArticle(
    currentUserId: string,
    slug: string,
  ): Promise<ArticleEntity> {
    
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) throw new NotFoundException('Article Not found!');

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: { favortiedArticles: true },
    });
    if (!user) throw new NotFoundException('User Not found!');

    const isFavorited =
      user.favortiedArticles.findIndex(
        (favoritedArticle) => favoritedArticle.id === article.id,
      ) !== -1;

    if (isFavorited) {
      user.favortiedArticles = user.favortiedArticles.filter(
        (favoritedArticle) => favoritedArticle.id !== article.id,
      );

      article.likesCount--;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);

    } else {
      throw new ForbiddenException(
        'User not liked this article. so cannot dislike this article!',
      );
    }

    return article;
  }

  /** @todo: we should'nt display password in the following query result */
  async getAllArticles(query: GetAllArticlesDto): Promise<ArticleEntity[]> {
    const limit = 5;
    const { author, tag, page, orderByCreation } = query;
    const qb = this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .leftJoinAndSelect('articles.updaterAuthor', 'updaterAuthor')
      .take(limit)
      .orderBy(
        'articles.created_at',
        orderByCreation === 'newest' || orderByCreation === undefined
          ? 'DESC'
          : 'ASC',
      )
      .skip(((page || 1) - 1) * limit);

    if (author) qb.where('author.username = :author', { author });

    if (tag) qb.andWhere('articles.tagsList LIKE :tag', { tag: `%${tag}%` });

    return await qb.getMany();
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
    const article = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.slug = :slug', { slug })
      .getOne();

    if (!article) throw new NotFoundException('Article not found');

    if (article.author.id !== currentUserId) {
      throw new ForbiddenException(
        'just Author of this article can delete this article',
      );
    }
    return await this.articleRepository.delete({ slug: article.slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUser: UserEntity,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) throw new NotFoundException('Article Not found!');

    Object.assign(article, updateArticleDto);
    article.slug = this.createSlug(article);
    article.updaterAuthor = currentUser;

    return await this.articleRepository.save(article);
  }

  createSlug(article: ArticleEntity): string {
    return (
      article.title.split(' ').join('-') +
      '--' +
      ((Math.random() * Math.pow(36, 6)) | 0)
    );
  }

  createArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }
}
