import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { schedulerConfig } from './config/scheduler.config';

@Module({
  imports: [ConfigModule.forFeature(schedulerConfig), ScheduleModule.forRoot()],
})
export class SchedulerModule {}
