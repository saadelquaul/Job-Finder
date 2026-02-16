import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {SearchBar} from '../../shared/components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [
    SearchBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router) {}

  handleSearch(term: string) {
    console.log('Search for:', term);
    }
}
