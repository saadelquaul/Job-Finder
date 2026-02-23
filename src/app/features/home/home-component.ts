import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {SearchBar} from '../../shared/components/search-bar/search-bar';
import {JobListComponent} from '../jobs/job-list/job-list-component';
import {JobService} from '../../core/services/job-service';

@Component({
  selector: 'app-home',
  imports: [
    SearchBar,
    JobListComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit{
  public jobService = inject(JobService);

  ngOnInit() {
    this.jobService.loadJobs();
  }

  onSearch(term: string) {
    this.jobService.search(term);
  }

  nextPage() {
    this.jobService.setPage(this.jobService.currentPage() + 1);
    scrollTo(0,0);
  }

  prevPage() {
    this.jobService.setPage(this.jobService.currentPage() - 1);
  }
}
