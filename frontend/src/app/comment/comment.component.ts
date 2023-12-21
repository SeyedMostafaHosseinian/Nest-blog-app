import { Component, Input } from '@angular/core';
import { CommentInterface } from 'src/types/comment.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment!: CommentInterface;
  @Input() commentDescendantNumber = 1;
}
