import { ArticleInterface } from 'src/types/article.interface';
import { ArticleService } from '../../services/articles.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  latestArticles!: ArticleInterface[];
  constructor(private readonly articleService: ArticleService) {}
  ngOnInit(): void {
    this.getLatestArticles();
  }

  getLatestArticles() {
    this.articleService.getAllArticles().subscribe((articles) => {
      this.latestArticles = articles;
    });
  }
}
