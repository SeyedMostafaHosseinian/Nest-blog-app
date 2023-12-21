import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private readonly http: HttpClient) {}

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
}
