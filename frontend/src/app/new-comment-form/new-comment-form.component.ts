import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArticleService } from 'src/services/articles.service';

@Component({
  selector: 'app-new-comment-form',
  templateUrl: './new-comment-form.component.html',
  styleUrls: ['./new-comment-form.component.scss'],
})
export class NewCommentFormComponent implements OnInit {
  @Input() slug!: string;

  commentForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      title: [],
      description: [],
    });
  }

  createComment() {
    const { title, description } = this.commentForm.getRawValue();
    this.articleService
      .addCommentToArticle(this.slug, title, description)
      .subscribe();
  }
}
