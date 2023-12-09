import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  getAllArticles() {
    return 'all articles';
  }
}
