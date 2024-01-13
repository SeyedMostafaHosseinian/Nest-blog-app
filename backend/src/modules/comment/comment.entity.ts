import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ArticleEntity } from '../article/article.entity';

@Entity('comments')
@Tree('closure-table')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.articleComments)
  author: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;

  @TreeParent()
  parentComment: CommentEntity | null;

  @TreeChildren()
  childrenComments: CommentEntity[] | null;
}
