import { CommentService } from './comment.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentResponse } from './types/comment-response.interface';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('articles/:slug')
  @UseGuards(AuthGuard)
  async addCommentToArticle(
    @Param('slug') articleSlug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
    @User('id') currentUserId: string,
  ): Promise<CommentResponse> {
    const comment = await this.commentService.createCommentForArticle(
      articleSlug,
      createCommentDto,
      currentUserId,
    );
    return this.commentService.createCommentResponse(comment);
  }

}
