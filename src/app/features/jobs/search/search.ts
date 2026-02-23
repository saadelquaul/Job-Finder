import { Component, OnInit, signal } from '@angular/core';
import { SearchBar } from './search-bar/search-bar';
import { JobList } from './job-list/job-list';
import { Job } from '../../../core/models/job.model';
import { JobService } from '../../../core/services/job-service';

@Component({
  selector: 'app-search',
  imports: [SearchBar, JobList],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit{
  jobs = signal<Job[]>([]);
  loading = signal<boolean>(false);
  searched = signal<boolean>(false);
  errorMessage = signal<string>('');
  totalPages = signal<number>(1);
  currentPage = 1;
  currentKeyword = '';
  currentLocation = '';

  constructor(private jobService: JobService) { }

 ngOnInit(){
    this.fetchJobs();
  }

  onSearch(filters: { keyword: string; location: string }): void {
    this.currentKeyword = filters.keyword;
    this.currentLocation = filters.location;
    this.currentPage = 1;
    this.fetchJobs();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchJobs();
  }

  private fetchJobs(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.searched.set(true);

    this.jobService.searchJobs(this.currentKeyword, this.currentLocation, this.currentPage).subscribe({
      next: (result) => {
        this.jobs.set(result.jobs);
        this.totalPages.set(Math.ceil(result.jobs.length/10));
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message || 'Erreur lors de la recherche');
      },
    });
  }
}
