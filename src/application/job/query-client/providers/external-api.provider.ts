import { ExternalJob } from '../models/external-api-job.model';

export interface ExternalApiProvider {
  getJobs(): Promise<ExternalJob[]>;
}

export const SOURCE_1_PROVIDER = 'source-1-provider';
export const SOURCE_2_PROVIDER = 'source-2-provider';
