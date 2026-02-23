import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../../../../core/models/job.model';
import { JobCard } from '../job-card/job-card';

@Component({
  selector: 'app-job-list',
  imports: [JobCard],
  templateUrl: './job-list.html',
  styleUrl: './job-list.css',
})
export class JobList {
  @Input() jobs: Job[] = [];
  @Input() currentPage = 1;
  @Input() totalPages!:number;
  @Output() pageChange = new EventEmitter<number>();

  get paginatedJobs(): Job[] {
    // Client-side pagination: 10 items per page
    const start = 0;
    const end = 10;
    return this.jobs.slice(start, end);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
