import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  SOURCE_1_PROVIDER,
  SOURCE_2_PROVIDER,
} from './providers/external-api.provider';
import { Source1HttpService } from './source-1/source-1-http.service';
import { Source2HttpService } from './source-2/source-2-http.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: SOURCE_1_PROVIDER,
      useClass: Source1HttpService,
    },
    {
      provide: SOURCE_2_PROVIDER,
      useClass: Source2HttpService,
    },
  ],
  exports: [SOURCE_1_PROVIDER, SOURCE_2_PROVIDER],
})
export class QueryClientModule {}
