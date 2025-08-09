import { ILimitationOptions } from '@common/pagination/limitation.interface';
import { SortOrder } from '@common/enums/sort-order.enum';

export class GetJobOfferListOptions {
  sortBy?: GetJobOfferListSortBy;
  sortOrder?: SortOrder;
  jobTitle?: string;
  state?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  limitation?: ILimitationOptions;
}

export enum GetJobOfferListSortBy {
  DATE = 'date',
  SALARY = 'salary',
}
