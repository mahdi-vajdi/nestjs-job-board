import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { httpConfig } from './http/config/http.config';
import { JobModule } from '@job/job.module';
import { JobHttpController } from './http/controllers/job/job-http.controller';

@Module({
  imports: [ConfigModule.forFeature(httpConfig), JobModule],
  controllers: [JobHttpController],
})
export class PresentationModule {}
