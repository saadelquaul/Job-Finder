import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { ApplicationsService } from '../../../core/services/applications-service';
import { Application } from '../../../core/models/applications.model';
import { ApplicationCard } from './application-card/application-card';

@Component({
  selector: 'app-applications-page',
  imports: [ApplicationCard],
  templateUrl: './applications-page.html',
  styleUrl: './applications-page.css',
})
export class ApplicationsPage implements OnInit {
  applications = signal<Application[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private applicationsService: ApplicationsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const user = this.authService.currentUser;
    if (!user?.id) return;

    this.loading.set(true);
    this.applicationsService.getApplications(user.id).subscribe({
      next: (apps) => {
        this.applications.set(apps) ;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onUpdate(application: Application): void {
    this.applicationsService.updateApplication(application).subscribe({
      next: (updated) => {
        const index = this.applications().findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          this.applications()[index] = updated;
        }
      },
    });
  }

  onRemove(id: number): void {
    this.applicationsService.removeApplication(id).subscribe({
      next: () => {
        this.applications.set(this.applications().filter((a) => a.id !== id));
      },
    });
  }
}
