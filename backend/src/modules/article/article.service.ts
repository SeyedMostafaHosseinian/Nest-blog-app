import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository, TreeRepository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleResponseInterface } from './types/article-response.interface';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetAllArticlesDto } from './dto/get-all-articles.dto';
import { CommentEntity } from '../comment/comment.entity';
import { RolesEnum } from '../../types/role/roles.enum';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: TreeRepository<CommentEntity>,
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
      relations: { favoredArticles: true },
    });
    if (!user) throw new NotFoundException('User Not found!');

    const isNotFavored =
      user.favoredArticles.findIndex(
        (favoredArticle) => favoredArticle.id === article.id,
      ) === -1;

    if (isNotFavored) {
      user.favoredArticles.push(article);
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
      relations: { favoredArticles: true },
    });
    if (!user) throw new NotFoundException('User Not found!');

    const isFavored =
      user.favoredArticles.findIndex(
        (favoredArticle) => favoredArticle.id === article.id,
      ) !== -1;

    if (isFavored) {
      user.favoredArticles = user.favoredArticles.filter(
        (favoredArticle) => favoredArticle.id !== article.id,
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
  async getAllArticles(
    query: GetAllArticlesDto,
    currentUserId: string,
  ): Promise<ArticleEntity[]> {
    this.articleRepository.find({ relations: {} });
    const limit = 5;
    const {
      author,
      tag,
      page,
      orderByCreation,
      justFavored: justFavored,
    } = query;
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

    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: {
        favoredArticles: true,
      },
    });

    const favoredIds = user.favoredArticles.map((ar) => ar.id);

    if (justFavored && user) {
      qb.andWhere('articles.id IN(:...ids)', { ids: favoredIds });
    }

    const articles = await qb.getMany();
    const articlesByFavored = articles.map((ar) => {
      const favored = favoredIds.includes(ar.id);
      return {
        ...ar,
        favored: favored,
      };
    });
    return articlesByFavored;
  }

  async getUserFeed(
    getUserFeedQuery: GetAllArticlesDto,
    currentUserId: string,
  ) {
    const { page } = getUserFeedQuery;
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId,
      },
      relations: {
        following: true,
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    const userFollowingIds = user.following.map((f) => f.id);
    const limit = 5;
    const articles = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('author.id IN(:...ids)', { ids: userFollowingIds })
      .orderBy('articles.created_at', 'DESC')
      .take(limit)
      .skip(((page || 1) - 1) * limit)
      .getMany();

    return articles;
  }

  /** @todo: we should'nt display password in the following query result */
  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: {
        author: true,
      },
    });

    if (!article) throw new NotFoundException('Article not found!');

    let comments = await this.commentRepository.findTrees({
      relations: ['article', 'author'],
    });
    comments = comments.filter((c) => c.article.id === article.id);

    const optimizedComments = this.deleteAdditionalArticleProperty(
      comments,
    ) as CommentEntity[];

    return {
      ...article,
      comments: [...optimizedComments],
    };
  }

  async deleteArticle(slug: string, currentUserId: string): Promise<any> {
    const article = await this.articleRepository
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.slug = :slug', { slug })
      .getOne();

    if (!article) throw new NotFoundException('Article not found');

    if (
      /** check author of this articles */
      article.author.id !== currentUserId &&
      /** check not admin or sub_admin and just author */
      article.author.roles.map(
        (r) => ![RolesEnum.Admin, RolesEnum.SubAdmin].includes(r),
      )
    ) {
      throw new ForbiddenException(
        'just Author of this article and admins and sub_admin can delete this article',
      );
    }
    return await this.articleRepository.remove(article);
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

  deleteAdditionalArticleProperty(comments: CommentEntity[]) {
    /** sort by date (DESC) newest comments are in the top */
    comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    /** traverse on the child of comment and delete article property */
    for (let comment of comments) {
      delete comment.article;
      if (comment.childrenComments.length) {
        this.deleteAdditionalArticleProperty(comment.childrenComments);
      }
    }

    return comments;
  }
}
