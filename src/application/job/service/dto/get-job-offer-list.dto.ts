import { SortOrder } from '@common/enums/sort-order.enum';
import { ILimitationOptions } from '@common/pagination/limitation.interface';
import { GetJobOfferListSortBy } from '@job/database/providers/options/get-job-offer-list.options';

export class GetJobOfferList {
  limitation: ILimitationOptions;
  sortBy?: GetJobOfferListSortBy;
  sortOrder?: SortOrder;
  jobTitle?: string;
  state?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
}
