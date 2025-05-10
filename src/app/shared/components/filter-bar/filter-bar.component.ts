import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <div class="filter-container">
      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Search</mat-label>
        <input matInput [(ngModel)]="searchQuery" (input)="onFilterChange()" placeholder="Search alerts...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Weather Type</mat-label>
        <mat-select [(ngModel)]="selectedType" (selectionChange)="onFilterChange()">
          <mat-option value="">All Types</mat-option>
          <mat-option value="Thunderstorm">Thunderstorm</mat-option>
          <mat-option value="Rain">Rain</mat-option>
          <mat-option value="Snow">Snow</mat-option>
          <mat-option value="Fog">Fog</mat-option>
          <mat-option value="Wind">Wind</mat-option>
          <mat-option value="Heat">Heat</mat-option>
          <mat-option value="Cold">Cold</mat-option>
          <mat-option value="Flood">Flood</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Severity</mat-label>
        <mat-select [(ngModel)]="selectedSeverity" (selectionChange)="onFilterChange()">
          <mat-option value="">All Severities</mat-option>
          <mat-option value="extreme">Extreme</mat-option>
          <mat-option value="severe">Severe</mat-option>
          <mat-option value="moderate">Moderate</mat-option>
          <mat-option value="minor">Minor</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-field">
        <mat-label>Sort By</mat-label>
        <mat-select [(ngModel)]="sortBy" (selectionChange)="onFilterChange()">
          <mat-option value="date-desc">Newest First</mat-option>
          <mat-option value="date-asc">Oldest First</mat-option>
          <mat-option value="severity-desc">Most Severe</mat-option>
          <mat-option value="severity-asc">Least Severe</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-button color="primary" (click)="clearFilters()">
        Clear Filters
      </button>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .filter-field {
      flex: 1;
      min-width: 200px;
    }

    @media (max-width: 768px) {
      .filter-field {
        min-width: 100%;
      }
    }
    /* Dark mode styles */
    :host-context(.dark-theme) .filter-container {
      background: #232a34;
      color: #f4f6fb;
    }
    :host-context(.dark-theme) .filter-container input,
    :host-context(.dark-theme) .filter-container select,
    :host-context(.dark-theme) .filter-container .mat-form-field-infix {
      background: #232a34;
      color: #f4f6fb;
      border-color: #333a4d;
    }
    :host-context(.dark-theme) .filter-container .mat-form-field-label {
      color: #b0bec5;
    }
    :host-context(.dark-theme) .filter-container .mat-select-value {
      color: #f4f6fb;
    }
    :host-context(.dark-theme) .filter-container .mat-icon {
      color: #90caf9;
    }
  `]
})
export class FilterBarComponent {
  @Output() filterChange = new EventEmitter<{
    search: string;
    type: string;
    severity: string;
    sortBy: string;
  }>();

  searchQuery = '';
  selectedType = '';
  selectedSeverity = '';
  sortBy = 'date-desc';

  onFilterChange() {
    this.filterChange.emit({
      search: this.searchQuery,
      type: this.selectedType,
      severity: this.selectedSeverity,
      sortBy: this.sortBy
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedSeverity = '';
    this.sortBy = 'date-desc';
    this.onFilterChange();
  }
} 