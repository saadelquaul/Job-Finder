import {JobOfferModel} from './job-offer-model';

export interface JobApiResponse {
  data: JobOfferModel[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    terms: string;
    info: string;
  };
}
