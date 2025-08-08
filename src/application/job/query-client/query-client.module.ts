import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  SOURCE_1_PROVIDER,
  SOURCE_2_PROVIDER,
} from './providers/external-api.provider';
import { Source1HttpService } from './source-1/source-1-http.service';
import { Source2HttpService } from './source-2/source-2-http.service';
import { ConfigModule } from '@nestjs/config';
import { source1Config } from './source-1/config/source-1.config';
import { source2Config } from './source-2/config/source-2.config';

@Module({
  imports: [
    ConfigModule.forFeature(source1Config),
    ConfigModule.forFeature(source2Config),
    HttpModule,
  ],
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
