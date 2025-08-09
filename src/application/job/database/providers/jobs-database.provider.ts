import { IEmployer, IEmployerEntity } from '../../models/employer.entity';
import { ILocation, ILocationEntity } from '../../models/location.model';
import { IJob, IJobEntity } from '../../models/job.model';
import { IRequirement } from '../../models/requirement.model';
import { ICompensation } from '../../models/compensation.model';

export interface JobDatabaseReader {
  getEmployer(name: string): Promise<IEmployerEntity>;

  getLocation(state: string, city: string): Promise<ILocationEntity>;
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
