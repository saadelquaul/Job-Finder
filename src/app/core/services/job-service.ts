import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {JobApiResponse} from '../models/job-api-response';
import {JobOfferModel} from '../models/job-offer-model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private API_URL = 'https://www.arbeitnow.com/api/job-board-api';

  searchJobs(keyword: string, location: string, page: number = 1): Observable<{
    jobs: JobOfferModel[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>{
    return this.http.get<JobApiResponse>(this.API_URL, {
      params: new HttpParams().set('page', page.toString()),
    }).pipe(
      map((response) => {
        let filteredJobs = response.data;

        // Filter by keyword in title only (business rule)
        if (keyword && keyword.trim()) {
          const lowerKeyword = keyword.toLowerCase().trim();
          filteredJobs = filteredJobs.filter((job) =>
            job.title.toLowerCase().includes(lowerKeyword)
          );
        }

        // Filter by location
        if (location && location.trim()) {
          const lowerLocation = location.toLowerCase().trim();
          filteredJobs = filteredJobs.filter((job) =>
            job.location.toLowerCase().includes(lowerLocation)
          );
        }

        // Sort by date
        filteredJobs.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return {
          jobs: filteredJobs,
          totalPages: response.meta.last_page,
          currentPage: response.meta.current_page,
          total: response.meta.total,
        };
      })
    );
  }


}
