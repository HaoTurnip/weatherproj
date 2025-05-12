import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="filter-container">
      <div class="search-field">
        <mat-icon>location_on</mat-icon>
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="onFilterChange()" 
          placeholder="Search by location"
          class="filter-input"
        >
      </div>

      <div class="filter-field">
        <label>Weather Type</label>
        <select [(ngModel)]="selectedType" (change)="onFilterChange()" class="select-input">
          <option value="">All Types</option>
          <option value="Thunderstorm">Thunderstorm</option>
          <option value="Rain">Rain</option>
          <option value="Snow">Snow</option>
          <option value="Fog">Fog</option>
          <option value="Wind">Wind</option>
          <option value="Heat">Heat</option>
          <option value="Cold">Cold</option>
          <option value="Flood">Flood</option>
        </select>
      </div>

      <div class="filter-field">
        <label>Severity</label>
        <select [(ngModel)]="selectedSeverity" (change)="onFilterChange()" class="select-input">
          <option value="">All Severities</option>
          <option value="extreme">Extreme</option>
          <option value="severe">Severe</option>
          <option value="moderate">Moderate</option>
          <option value="minor">Minor</option>
        </select>
      </div>

      <div class="filter-field">
        <label>Sort By</label>
        <select [(ngModel)]="sortBy" (change)="onFilterChange()" class="select-input">
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="severity-desc">Most Severe</option>
          <option value="severity-asc">Least Severe</option>
          <option value="upvotes-desc">Most Upvotes</option>
          <option value="upvotes-asc">Least Upvotes</option>
        </select>
      </div>

      <button class="clear-button" (click)="clearFilters()">
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
      background: #f9fbfd;
      border-radius: 12px;
      margin-bottom: 24px;
      align-items: flex-end;
    }

    .filter-field {
      flex: 1;
      min-width: 150px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
    }

    .search-field {
      flex: 1;
      min-width: 150px;
      position: relative;
      display: flex;
      align-items: center;
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      padding: 0 12px;
      transition: all 0.2s ease;
    }

    .search-field:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-field mat-icon {
      color: #64748b;
      margin-right: 8px;
    }

    .filter-input {
      border: none;
      outline: none;
      padding: 10px 0;
      width: 100%;
      background: transparent;
      color: #1e293b;
      font-size: 0.95rem;
    }

    .select-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #1e293b;
      font-size: 0.95rem;
      outline: none;
      cursor: pointer;
      background-color: white;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 12px center;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding-right: 30px;
    }

    /* For older Edge/IE */
    .select-input::-ms-expand {
      display: none;
    }

    .select-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .select-input:hover {
      border-color: #cbd5e1;
    }

    .clear-button {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #3b82f6;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .clear-button:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    @media (max-width: 768px) {
      .filter-field, .search-field {
        min-width: 100%;
      }
    }

    /* Dark mode styles */
    :host-context(.dark-theme) .filter-container {
      background: #0f172a;
      color: #f8fafc;
    }

    :host-context(.dark-theme) label {
      color: #f8fafc;
    }

    :host-context(.dark-theme) .search-field {
      background: #1e293b;
      border-color: #334155;
    }

    :host-context(.dark-theme) .search-field:focus-within {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    :host-context(.dark-theme) .search-field mat-icon {
      color: #94a3b8;
    }

    :host-context(.dark-theme) .filter-input {
      color: #f8fafc;
    }

    :host-context(.dark-theme) .filter-input::placeholder {
      color: #94a3b8;
    }

    :host-context(.dark-theme) .select-input {
      background-color: #1e293b;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      border-color: #334155;
      color: #f8fafc;
    }

    :host-context(.dark-theme) .select-input:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    :host-context(.dark-theme) .select-input:hover {
      border-color: #475569;
    }

    :host-context(.dark-theme) .clear-button {
      border-color: #60a5fa;
      color: #60a5fa;
    }

    :host-context(.dark-theme) .clear-button:hover {
      background: rgba(96, 165, 250, 0.15);
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