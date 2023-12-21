import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService
  ) {}

  getAllArticles(): Observable<any> {
    return this.http.get('http://localhost:3000/articles', {
      responseType: 'json',
    });
  }

  getArticleBySlug(slug: string) {
    return this.http.get(`http://localhost:3000/articles/${slug}`, {
      responseType: 'json',
    });
  }

  addCommentToArticle(slug: string, title: string, description: string) {
    const accessToken = this.userService.getAccessTokenFromCookies();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `http://localhost:3000/comments/articles/${slug}`,
      {
        comment: {
          title,
          description,
        },
      },
      {
        headers: headers,
      }
    );
  }
}
