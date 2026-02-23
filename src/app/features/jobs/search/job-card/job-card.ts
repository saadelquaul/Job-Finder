import {Component, Input} from '@angular/core';
import { Job } from '../../../../core/models/job.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service';
import { ApplicationsService } from '../../../../core/services/applications-service';
import { Store } from '@ngrx/store';
import { selectIsFavorite } from '../../../../store/favorites/favorites.selectors';
import { Favorite } from '../../../../core/models/favorite.model';
import { Application } from '../../../../core/models/applications.model';
import * as FavoritesActions from '../../../../store/favorites/favorites.actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TruncatePipe } from '../../../../shared/pipes/truncate-pipe';


@Component({
  selector: 'app-job-card',
  imports: [TruncatePipe, AsyncPipe, DatePipe],
  templateUrl: './job-card.html',
  styleUrl: './job-card.css',
})
export class JobCard {
   @Input() job!: Job;

  isFavorite$!: Observable<boolean>;
  applicationAdded = false;

  constructor(
    public authService: AuthService,
    private store: Store,
    private applicationsService: ApplicationsService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.isFavorite$ = this.store.select(selectIsFavorite(this.job.slug));
    }
  }

  toggleFavorite(): void {
    const user = this.authService.currentUser;
    if (!user?.id) return;

    const favorite: Favorite = {
      userId: user.id,
      offerId: this.job.slug,
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
    };

    this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
  }

  trackApplication(): void {
    const user = this.authService.currentUser;
    if (!user?.id) return;

    const application: Application = {
      userId: user.id,
      offerId: this.job.slug,
      apiSource: 'arbeitnow',
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
      url: this.job.url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString(),
    };

    this.applicationsService.addApplication(application).subscribe({
      next: () => {
        this.applicationAdded = true;
      },
      error: (err) => {
        console.error('Erreur suivi candidature:', err);
      },
    });
  }

}
