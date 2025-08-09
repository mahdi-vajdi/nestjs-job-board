import { Test, TestingModule } from '@nestjs/testing';
import { JobScheduleService } from './job-schedule.service';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobService } from '../../job/service/job.service';
import { SCHEDULER_CONFIG_TOKEN } from '../config/scheduler.config';
import { CronJob } from 'cron';

// Mock the CronJob class
jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation((pattern, onTick) => {
    return {
      start: jest.fn(),
      stop: jest.fn(),
      // Expose the onTick function to be able to trigger it manually in tests
      onTick: onTick,
    };
  }),
}));

describe('JobScheduleService', () => {
  let service: JobScheduleService;
  let schedulerRegistry: SchedulerRegistry;
  let jobService: JobService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue({ fetchExternalApiCronPattern: '0 0 * * *' }),
  };

  const mockSchedulerRegistry = {
    addCronJob: jest.fn(),
    getCronJob: jest.fn(),
  };

  const mockJobService = {
    processJobsFromExternalApis: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobScheduleService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    service = module.get<JobScheduleService>(JobScheduleService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
    jobService = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should schedule and start a cron job on module initialization', () => {
      service.onModuleInit();

      expect(mockConfigService.get).toHaveBeenCalledWith(SCHEDULER_CONFIG_TOKEN);

      const cronPattern = '0 0 * * *';
      expect(CronJob).toHaveBeenCalledWith(cronPattern, expect.any(Function));

      expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'fetch-jobs-from-external-api',
        expect.any(Object),
      );

      // Check if the job's start method was called
      const cronJobInstance = (CronJob as jest.Mock).mock.results[0].value;
      expect(cronJobInstance.start).toHaveBeenCalled();
    });

    it('should call processJobsFromExternalApis when the cron job is triggered', () => {
      service.onModuleInit();

      // Get the onTick function from the CronJob mock
      const cronJobInstance = (CronJob as jest.Mock).mock.results[0].value;
      const onTick = cronJobInstance.onTick;

      // Manually trigger the cron job's task
      onTick();

      expect(jobService.processJobsFromExternalApis).toHaveBeenCalled();
    });
  });
});
