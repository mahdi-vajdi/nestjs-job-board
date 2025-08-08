import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Source2Config, SOURCE_2_CONFIG_TOKEN } from './config/source-2.config';
import { ExternalApiProvider } from '../providers/external-api.provider';
import { ExternalJob } from '../models/external-api-job.model';
import { Source2ApiResponse } from './models/source-2-reponse.model';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Source2HttpService implements ExternalApiProvider {
  private readonly config: Source2Config;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.config = configService.get<Source2Config>(SOURCE_2_CONFIG_TOKEN);
  }

  async getJobs(): Promise<ExternalJob[]> {
    const res = await lastValueFrom(
      this.httpService.get<Source2ApiResponse>(this.config.url),
    );

    return Object.entries(res.data.data.jobsList).map(
      ([jobId, job]): ExternalJob => ({
        details: {
          id: jobId,
          positionTitle: job.position,
          remote: job.location.remote,
          type: null, // Type not provided in the response
          datePosted: new Date(job.datePosted),
        },
        location: {
          state: job.location.state,
          city: job.location.city,
        },
        employer: {
          name: job.employer.companyName,
          industry: null, // Industry not provided in the response
          website: job.employer.website,
        },
        compensation: {
          salaryMin: job.compensation.min,
          salaryMax: job.compensation.max,
          salaryCurrency: job.compensation.currency,
        },
        requirements: {
          skills: job.requirements.technologies,
          experience: job.requirements.experience,
        },
      }),
    );
  }
}
