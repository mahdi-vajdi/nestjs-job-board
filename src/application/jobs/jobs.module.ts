import { Module } from '@nestjs/common';
import { QueryClientModule } from './query-client/query-client.module';

@Module({
  imports: [QueryClientModule],
})
export class JobsModule {}
