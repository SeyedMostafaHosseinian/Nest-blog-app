import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { ArticleService } from 'src/services/articles.service';

@Component({
  selector: 'app-new-comment-form',
  templateUrl: './new-comment-form.component.html',
  styleUrls: ['./new-comment-form.component.scss'],
})
export class NewCommentFormComponent implements OnInit {
  @Input() slug!: string;
  @Input() commentParentId?: string;
  @Output() commentCreated = new EventEmitter()
  loading = false;

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
    this.loading = true;
    const { title, description } = this.commentForm.getRawValue();
    this.articleService
      .addCommentToArticle(this.slug, title, description, this.commentParentId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((d) => {
        this.commentCreated.next(d)
        this.commentForm.reset()
      });
  }
}
