import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  body: string;

  @Column({ default: '' })
  description: string;

  @Column('simple-array')
  tagsList: string[];

  @Column({ default: 0 })
  likesCount: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.contributedArticles)
  updaterAuthor: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: CommentEntity[];
}
