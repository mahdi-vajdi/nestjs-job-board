import { Module } from '@nestjs/common';
import { JobModule } from './application/job/job.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
      load: [appConfig],
    }),
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
