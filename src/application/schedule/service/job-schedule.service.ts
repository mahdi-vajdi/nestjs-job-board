import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SCHEDULER_CONFIG_TOKEN,
  SchedulerConfig,
} from '../config/scheduler.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class JobScheduleService implements OnModuleInit {
  private readonly config: SchedulerConfig;
  private readonly logger = new Logger(JobScheduleService.name);

  constructor(
    configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.config = configService.get<SchedulerConfig>(SCHEDULER_CONFIG_TOKEN);
  }

  onModuleInit() {
    const cronPattern = this.config.fetchExternalApiCronPattern;
    const job = new CronJob(cronPattern, () => this.fetchJobsFromExternalApi());
    this.schedulerRegistry.addCronJob('fetch-jobs-from-external-api', job);
    job.start();

    this.logger.log(
      `fetchJobsFromExternalApi scheduled with pattern: ${cronPattern}`,
    );
  }

  async fetchJobsFromExternalApi(): Promise<void> {}
}
