import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterCriteria {
  searchQuery: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.html'
})
export class Filter {
  searchQuery = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  categories = [
    'All',
    'Classic',
    'Fiction',
    'Thriller',
    'Horror',
    'Technology',
    'Psychology',
    'Entrepreneurship',
    'Finance',
    'Leadership',
    'Science',
    'History'
  ];

  @Output() filterChange = new EventEmitter<FilterCriteria>();

  onFilterChange(): void {
    const filterCriteria: FilterCriteria = {
      searchQuery: this.searchQuery,
      category: this.selectedCategory,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };
    this.filterChange.emit(filterCriteria);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.onFilterChange();
  }
}
