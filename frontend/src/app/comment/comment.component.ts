import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentInterface } from 'src/types/comment.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment!: CommentInterface;
  @Input() slug!: string;
  @Input() commentDescendantNumber = 1;
  @Output() replyAdded = new EventEmitter()

  displayNewCommentForm = false;

  toggleNewCommentForm() {
    this.displayNewCommentForm = !this.displayNewCommentForm
  }
}
