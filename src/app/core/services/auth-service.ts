import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap, map, BehaviorSubject} from 'rxjs';
import {User} from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.API_URL}?email=${email}`).pipe(
      map((users) => {
        const user = users.find((u) => u.password === password);
        if (!user) {
          throw new Error('Email ou mot de passe invalide');
        }
        return user;
      }),
      tap((user) => {
        const { password: _, ...userWithoutPassword } = user as User & { password: string };
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${user.id}`, user).pipe(
      tap((updatedUser) => {
        const { password: _, ...userWithoutPassword } = updatedUser as User & {
          password: string;
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);
      })
    );
  }

  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.API_URL}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }
}
