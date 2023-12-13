import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from 'src/modules/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  biography: string;

  @Column({ default: '' })
  image: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.updaterAuthor)
  contributedArticles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable({ name: 'users_favorited_articles' })
  favortiedArticles: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @ManyToMany(() => UserEntity, (user) => user.followers )
  following: UserEntity[]

  @ManyToMany(() => UserEntity, (user) => user.following )
  @JoinTable({name:'user_followers'})
  followers: UserEntity[]
}
