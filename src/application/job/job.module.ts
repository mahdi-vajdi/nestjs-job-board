import { Module } from '@nestjs/common';
import { QueryClientModule } from './query-client/query-client.module';
import { JobDatabaseModule } from './database/job-databse.module';
import { JobService } from '@job/service/job.service';

@Module({
  imports: [QueryClientModule, JobDatabaseModule],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
