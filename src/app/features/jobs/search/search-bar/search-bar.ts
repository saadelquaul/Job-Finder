import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  keyword = '';
  location = '';

  @Output() search = new EventEmitter<{ keyword: string; location: string }>();

  onSearch(): void {
    this.search.emit({
      keyword: this.keyword,
      location: this.location,
    });
  }

}
