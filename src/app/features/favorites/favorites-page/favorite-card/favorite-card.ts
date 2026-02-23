import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Favorite } from '../../../../core/models/favorite.model';

@Component({
  selector: 'app-favorite-card',
  imports: [],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.css',
})
export class FavoriteCard {
 @Input() favorite!: Favorite;
  @Output() remove = new EventEmitter<number>();

  onRemove(): void {
    if (this.favorite.id) {
      this.remove.emit(this.favorite.id);
    }
  }
}
