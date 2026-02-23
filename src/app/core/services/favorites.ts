import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root',
})
export class Favorites {
  private readonly API_URL = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) { }

  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.API_URL}?userId=${userId}`);
  }

  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.API_URL, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  isFavorite(userId: number, offerId: string): Observable<boolean> {
    return this.http
      .get<Favorite[]>(`${this.API_URL}?userId=${userId}&offerId=${offerId}`)
      .pipe(map((favs) => favs.length > 0));
  }
}
