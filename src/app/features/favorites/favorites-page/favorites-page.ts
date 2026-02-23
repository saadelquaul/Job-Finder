import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';
import { Favorite } from '../../../core/models/favorite.model';
import { FavoriteCard } from './favorite-card/favorite-card';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-favorites-page',
  imports: [FavoriteCard, AsyncPipe],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage implements
  OnInit {
  favorites$!: Observable<Favorite[]>;
  loading$!: Observable<boolean>;

  constructor(
    private store: Store,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.favorites$ = this.store.select(selectAllFavorites);
    this.loading$ = this.store.select(selectFavoritesLoading);

    const user = this.authService.currentUser;
    if (user?.id) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    }
  }

  onRemove(id: number): void {
    this.store.dispatch(FavoritesActions.removeFavorite({ id }));
  }

}
