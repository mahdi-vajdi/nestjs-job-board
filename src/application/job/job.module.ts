import { Module } from '@nestjs/common';
import { QueryClientModule } from './query-client/query-client.module';
import { JobDatabaseModule } from './database/job-databse.module';

@Module({
  imports: [QueryClientModule, JobDatabaseModule],
})
export class JobModule {}
