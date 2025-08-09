import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  JOB_DATABASE_READER_TOKEN,
  JOB_DATABASE_WRITER_TOKEN,
  JobDatabaseReader,
  JobDatabaseWriter,
} from '../database/providers/jobs-database.provider';
import { ExternalJob } from '../query-client/models/external-api-job.model';
import {
  ExternalApiProvider,
  SOURCE_1_PROVIDER,
  SOURCE_2_PROVIDER,
} from '../query-client/providers/external-api.provider';
import { IEmployer, IEmployerEntity } from '../models/employer.entity';
import { ILocation } from '../models/location.model';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @Inject(SOURCE_1_PROVIDER)
    private readonly source1ApiProvider: ExternalApiProvider,
    @Inject(SOURCE_2_PROVIDER)
    private readonly source2ApiProvider: ExternalApiProvider,
    @Inject(JOB_DATABASE_READER_TOKEN)
    private readonly jobDatabaseReader: JobDatabaseReader,
    @Inject(JOB_DATABASE_WRITER_TOKEN)
    private readonly jobDatabaseWriter: JobDatabaseWriter,
  ) {}

  async processJobsFromExternalApis(): Promise<void> {
    try {
      const externalJobs = await this.getJobsFromExternalApis();

      for (const job of externalJobs) {
        const location = await this.getOrCreateLocation({
          state: job.location.state,
          city: job.location.city,
        });
        const employer = await this.getOrCreateEmployer({
          name: job.employer.name,
          industry: job.employer.industry,
          website: job.employer.website,
        });

        await this.jobDatabaseWriter.createJob(
          {
            originalId: job.details.id,
            positionTitle: job.details.positionTitle,
            type: job.details.type,
            datePosted: job.details.datePosted,
            remote: job.details.remote,
            location: location,
            employer: employer,
          },
          {
            job: null,
            skills: job.requirements.skills,
            experienceYears: job.requirements.experience,
          },
          {
            job: null,
            salaryMin: job.compensation.salaryMin,
            salaryMax: job.compensation.salaryMax,
            salaryCurrency: job.compensation.salaryCurrency,
          },
        );
      }
    } catch (e) {
      this.logger.error(`error processing jobs from external APIs: ${e}`);
      throw e;
    }
  }

  async getOrCreateEmployer(iEmployer: IEmployer): Promise<IEmployerEntity> {
    try {
      const getEmployer = await this.jobDatabaseReader.getEmployer(
        iEmployer.name,
      );
      if (getEmployer) {
        return getEmployer;
      }

      return await this.jobDatabaseWriter.createEmployer(iEmployer);
    } catch (e) {
      this.logger.error(`error when getting or creating employer: ${e}`);
      throw e;
    }
  }

  async getOrCreateLocation(iLocation: ILocation): Promise<ILocation> {
    try {
      const getLocation = await this.jobDatabaseReader.getLocation(
        iLocation.state,
        iLocation.city,
      );
      if (getLocation) {
        return getLocation;
      }

      return await this.jobDatabaseWriter.createLocation(iLocation);
    } catch (e) {
      this.logger.error(`error when getting or creating location: ${e}`);
      throw e;
    }
  }

  private async getJobsFromExternalApis(): Promise<ExternalJob[]> {
    try {
      const [source1Jobs, source2Jobs] = await Promise.all([
        this.source1ApiProvider.getJobs(),
        this.source2ApiProvider.getJobs(),
      ]);

      return [...source1Jobs, ...source2Jobs];
    } catch (e) {
      this.logger.error(`error getting jobs from external APIs: ${e}`);
      throw e;
    }
  }
}
