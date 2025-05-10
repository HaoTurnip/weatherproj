import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="comment-card">
      <mat-card-header>
        <mat-card-title>Comments</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <!-- New Comment Form -->
        <form (ngSubmit)="onSubmitComment()" #commentForm="ngForm" class="comment-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Add a comment</mat-label>
            <textarea
              matInput
              [(ngModel)]="newComment"
              name="comment"
              required
              rows="3"
              placeholder="Write your comment here..."
              [disabled]="!isAuthenticated"
            ></textarea>
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!commentForm.form.valid || !isAuthenticated"
          >
            Post Comment
          </button>
          <div *ngIf="!isAuthenticated" class="login-message">
            Log in to post a comment.
          </div>
        </form>

        <mat-divider class="divider"></mat-divider>

        <!-- Comments List -->
        <div class="comments-list">
          @for (comment of comments; track comment.id) {
            <div class="comment">
              <div class="comment-header">
                <span class="user-name">{{ comment.userName }}</span>
                <span class="timestamp">{{ comment.timestamp | date:'medium' }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
              @if (comment.userId === currentUserId) {
                <button
                  mat-icon-button
                  color="warn"
                  (click)="onDeleteComment(comment.id)"
                  class="delete-button"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              }
            </div>
          }
          @if (comments.length === 0) {
            <p class="no-comments">No comments yet. Be the first to comment!</p>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .comment-card {
      margin: 16px 0;
    }

    .comment-form {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .divider {
      margin: 16px 0;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment {
      position: relative;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .user-name {
      font-weight: 500;
      color: #1976d2;
    }

    .timestamp {
      color: #666;
      font-size: 0.9em;
    }

    .comment-content {
      margin: 0;
      line-height: 1.5;
    }

    .delete-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .no-comments {
      text-align: center;
      color: #666;
      font-style: italic;
    }

    .login-message {
      color: #d32f2f;
      font-size: 0.95em;
      margin-top: 8px;
      font-weight: 500;
    }
  `]
})
export class CommentCardComponent {
  @Input() comments: Comment[] = [];
  @Input() currentUserId: string = '';
  @Input() isAuthenticated: boolean = false;
  @Output() addComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();

  newComment = '';

  onSubmitComment() {
    if (this.newComment.trim()) {
      this.addComment.emit(this.newComment);
      this.newComment = '';
    }
  }

  onDeleteComment(commentId: string) {
    this.deleteComment.emit(commentId);
  }
} 