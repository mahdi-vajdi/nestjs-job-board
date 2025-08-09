import { Module } from '@nestjs/common';
import { JobModule } from './application/job/job.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { SchedulerModule } from './application/schedule/scheduler.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
      load: [appConfig],
    }),
    SchedulerModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
