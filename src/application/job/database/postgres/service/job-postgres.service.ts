import { Injectable } from '@nestjs/common';
import {
  JobDatabaseReader,
  JobDatabaseWriter,
} from '../../providers/jobs-database.provider';

@Injectable()
export class JobPostgresService
  implements JobDatabaseReader, JobDatabaseWriter {}
