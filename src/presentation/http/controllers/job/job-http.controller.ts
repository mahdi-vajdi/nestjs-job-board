import { Controller, Get, Query } from '@nestjs/common';
import { JobService } from '@job/service/job.service';
import {
  GetJobOfferListResponse,
  GetJobOffersRequestQueries,
} from './models/get-job-offers.model';
import { PaginationHelper } from '@common/pagination/pagination-helper';
import { IPaginatedResult } from '@common/pagination/pagination.model';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Jobs')
export class JobHttpController {
  constructor(private readonly jobService: JobService) {}

  @Get('job-offers')
  async getJobsList(
    @Query() queries: GetJobOffersRequestQueries,
  ): Promise<IPaginatedResult<GetJobOfferListResponse>> {
    const pagination = new PaginationHelper(queries.page, queries.pageSize);

    const res = await this.jobService.getJobOfferList({
      limitation: {
        limit: pagination.getLimit(),
        skip: pagination.getSkip(),
      },
      sortBy: queries.sortBy,
      sortOrder: queries.sortOrder,
      jobTitle: queries.jobTitle,
      state: queries.state,
      city: queries.city,
      salaryMin: queries.salaryMin,
      salaryMax: queries.salaryMax,
    });

    return {
      page: res.page,
      pageSize: res.pageSize,
      total: res.total,
      list: res.list.map((job) => ({
        originalId: job.originalId,
        positionTitle: job.positionTitle,
        type: job.type,
        datePosted: job.datePosted,
        remote: job.remote,
        location: {
          state: job.location.state,
          city: job.location.city,
        },
        employer: {
          name: job.employer.name,
          website: job.employer.website,
          industry: job.employer.website,
        },
        requirement: {
          skills: job.requirement.skills,
          experienceYears: job.requirement.experienceYears,
        },
        compensation: {
          salaryMax: job.compensation.salaryMax,
          salaryMin: job.compensation.salaryMin,
          salaryCurrency: job.compensation.salaryCurrency,
        },
      })),
    };
  }
}
