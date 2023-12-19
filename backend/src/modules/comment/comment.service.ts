import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { CommentResponse } from './types/comment-response.interface';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createCommentForArticle(
    articleSlug: string,
    createArticleDto: CreateCommentDto,
    currentUserId: string,
  ): Promise<CommentEntity> {
    const article = await this.articleRepository.findOne({
      where: {
        slug: articleSlug,
      },
      relations: {
        comments: true,
      },
    });

    if (!article) throw new NotFoundException('article not found!');

    const author = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: {
        articleComments: true,
      },
    });

    if (!author) throw new NotFoundException('User not found!');

    const newComment = new CommentEntity();
    newComment.article = article;
    newComment.author = author;
    newComment.title = createArticleDto.title;
    newComment.description = createArticleDto.description;

    let parentComment: CommentEntity;

    if (createArticleDto.commentParentId) {
      parentComment = await this.commentRepository.findOne({
        where: {
          id: createArticleDto.commentParentId,
        },
        relations: {
          childrenComments: true,
          article: true,
        },
      });

      if (!parentComment)
        throw new NotFoundException('parent comment not found!');
      if (parentComment.article.slug !== newComment.article.slug)
        throw new ForbiddenException(
          'The post id of the desired comment does not match with the new comment',
        );

      newComment.parentComment = parentComment;
      console.log('parentComment', parentComment);
    }

    return await this.commentRepository.save(newComment);
  }

  createCommentResponse(comment: CommentEntity): CommentResponse {
    return { comment };
  }
}
