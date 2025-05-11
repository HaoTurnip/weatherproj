import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { Comment } from '../../../core/models/alert.model';

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
          <div class="search-field-wrapper comment-wrapper">
            <span class="search-icon">
              <mat-icon>comment</mat-icon>
            </span>
            <textarea
              class="search-input"
              [(ngModel)]="newComment"
              name="comment"
              required
              rows="3"
              placeholder="Write your comment here..."
              [disabled]="!isAuthenticated"
            ></textarea>
          </div>
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
                <span class="timestamp">{{ comment.createdAt | date:'medium' }}</span>
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
      color: #222;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .comment-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 8px;
      gap: 0.5em;
    }

    .user-name {
      font-weight: 500;
      color: #1976d2;
    }

    .timestamp {
      position: absolute;
      top: 8px;
      right: 16px;
      color: #666;
      font-size: 0.9em;
      white-space: nowrap;
      background: transparent;
    }

    .comment-content {
      margin: 0;
      line-height: 1.5;
    }

    .delete-button {
      position: absolute;
      top: 32px;
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

    /* Custom Search/Input Styles */
    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      border-radius: var(--radius-full, 9999px);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      margin: 0.75rem 0;
      width: 100%;
    }

    .comment-wrapper {
      border-radius: 12px;
      align-items: flex-start;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    .search-icon {
      color: var(--text-tertiary, #64748b);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      padding-top: 0.4rem;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      color: var(--text-primary, #334155);
      padding: 0.4rem 0;
      font-family: inherit;
      width: 100%;
      resize: none;
    }

    .search-input::placeholder {
      color: var(--text-tertiary, #64748b);
    }

    /* Button styling */
    button[mat-raised-button] {
      background-color: var(--primary-color, #3b82f6);
      color: white;
    }

    /* Dark theme support */
    :host-context(.dark-theme) .comment-card {
      background: var(--card-dark, #1e293b);
      color: white;
    }

    :host-context(.dark-theme) .comment {
      background: #232a34;
      color: #f4f6fb;
      border: 1px solid #2d3440;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    :host-context(.dark-theme) .user-name {
      color: #90caf9;
    }

    :host-context(.dark-theme) .timestamp {
      color: #b0bec5;
    }

    :host-context(.dark-theme) .no-comments {
      color: #b0bec5;
    }

    :host-context(.dark-theme) .login-message {
      color: #ff8a65;
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark, #1e293b);
      border-color: var(--border-dark, #334155);
    }

    :host-context(.dark-theme) .search-icon {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    :host-context(.dark-theme) .search-input {
      color: var(--text-primary-dark, #f8fafc);
    }

    :host-context(.dark-theme) .search-input::placeholder {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    :host-context(.dark-theme) button[mat-raised-button] {
      background-color: var(--primary-light, #60a5fa);
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