import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Favorites } from '../../core/services/favorites';
import * as FavoritesActions from './favorites.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class FavoritesEffects {

        private actions$ = inject(Actions);
        private favoritesService = inject(Favorites);


    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            mergeMap(({ userId }) =>
                this.favoritesService.getFavorites(userId).pipe(
                    map((favorites) => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError((error) =>
                        of(FavoritesActions.loadFavoritesFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(({ favorite }) =>
                this.favoritesService.addFavorite(favorite).pipe(
                    map((fav) => FavoritesActions.addFavoriteSuccess({ favorite: fav })),
                    catchError((error) =>
                        of(FavoritesActions.addFavoriteFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(({ id }) =>
                this.favoritesService.removeFavorite(id).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id })),
                    catchError((error) =>
                        of(FavoritesActions.removeFavoriteFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
