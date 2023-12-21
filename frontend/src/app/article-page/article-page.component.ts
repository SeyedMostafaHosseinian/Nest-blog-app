import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/services/articles.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss'],
})
export class ArticlePageComponent implements OnInit {
  artilceData: any;
  constructor(
    private route: ActivatedRoute,
    private readonly articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const slug = this.route.snapshot.params['slug'];

    if (slug) {
      this.articleService.getArticleBySlug(slug).subscribe((data:any )=> {
        this.artilceData = data.article;
        console.log(this.artilceData)
      })
    }
  }
}
