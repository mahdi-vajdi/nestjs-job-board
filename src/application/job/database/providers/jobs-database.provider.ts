import { IEmployer, IEmployerEntity } from '@job/models/employer.entity';
import { ILocation, ILocationEntity } from '@job/models/location.model';
import { IJob, IJobEntity } from '@job/models/job.model';
import { IRequirement } from '@job/models/requirement.model';
import { ICompensation } from '@job/models/compensation.model';
import { GetJobOfferListOptions } from '@job/database/providers/options/get-job-offer-list.options';

export interface JobDatabaseReader {
  getEmployer(name: string): Promise<IEmployerEntity>;

  getLocation(state: string, city: string): Promise<ILocationEntity>;

  getJobOfferList(
    options: GetJobOfferListOptions,
  ): Promise<[IJobEntity[], number]>;
}

export interface JobDatabaseWriter {
  createEmployer(iEmployer: IEmployer): Promise<IEmployerEntity>;

  createLocation(iLocation: ILocation): Promise<ILocation>;

  createJob(
    iJob: IJob,
    iRequirement: IRequirement,
    iCompensation: ICompensation,
  ): Promise<IJobEntity>;
}

export const JOB_DATABASE_READER_TOKEN = 'job-database-reader-token';
export const JOB_DATABASE_WRITER_TOKEN = 'job-database-writer-token';
