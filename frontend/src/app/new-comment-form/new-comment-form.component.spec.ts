import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCommentFormComponent } from './new-comment-form.component';

describe('NewCommentFormComponent', () => {
  let component: NewCommentFormComponent;
  let fixture: ComponentFixture<NewCommentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCommentFormComponent]
    });
    fixture = TestBed.createComponent(NewCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
