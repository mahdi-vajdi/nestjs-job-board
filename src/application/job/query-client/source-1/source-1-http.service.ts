import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ExternalApiProvider } from '../providers/external-api.provider';
import { ExternalJob } from '../models/external-api-job.model';
import { ConfigService } from '@nestjs/config';
import { Source2Config } from '../source-2/config/source-2.config';
import { SOURCE_1_CONFIG_TOKEN } from './config/source-1.config';
import { Source1ApiResponse } from './models/source-1-response.model';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Source1HttpService implements ExternalApiProvider {
  private readonly config: Source2Config;

  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.config = configService.get<Source2Config>(SOURCE_1_CONFIG_TOKEN);
  }

  async getJobs(): Promise<ExternalJob[]> {
    const res = await lastValueFrom(
      this.httpService.get<Source1ApiResponse>(this.config.url),
    );

    return res.data.jobs.map((job): ExternalJob => {
      const location = job.details.location.split(',');
      const salary = this.parseSalaryRange(job.details.salaryRange);
      return {
        details: {
          id: job.jobId,
          positionTitle: job.title,
          type: job.details.type,
          remote: null, // Remote status not provided in the response
          datePosted: new Date(job.postedDate),
        },
        location: {
          state: location[1]?.trim() || '',
          city: location[0]?.trim() || '',
        },
        employer: {
          name: job.company.name,
          industry: job.company.industry,
          website: null, // Website not provided in the response
        },
        compensation: {
          salaryMin: salary[0],
          salaryMax: salary[1],
          salaryCurrency: 'USD',
        },
        requirements: {
          skills: job.skills,
          experience: null, // Experience not provided in the response
        },
      };
    });
  }

  /**
   * Parses the salary range string into a tuple of numbers.
   * @param salaryRange
   * @throws Error if the salary range format is invalid.
   * @returns [mix, max]
   */
  private parseSalaryRange(salaryRange: string): [number, number] {
    const regex = /^\$(\d+(?:\.\d+)?)[kK]? - \$(\d+(?:\.\d+)?)[kK]?$/;
    const match = salaryRange.match(regex);

    if (!match) {
      throw new Error('Invalid salary range format');
    }

    const parseAmount = (val: string) => {
      const num = parseFloat(val);
      // If 'k' present, multiply by 1000
      return val.toLowerCase().includes('k') ? num * 1000 : num;
    };

    const min = parseAmount(match[1]);
    const max = parseAmount(match[2]);

    return [min, max];
  }
}
