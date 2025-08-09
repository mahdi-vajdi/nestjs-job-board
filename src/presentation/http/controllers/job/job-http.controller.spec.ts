import { Test, TestingModule } from '@nestjs/testing';
import { JobHttpController } from './job-http.controller';
import { JobService } from '@job/service/job.service';
import { GetJobOffersRequestQueries } from './models/get-job-offers.model';
import { PaginatedResult } from '@common/pagination/paginated-result';

describe('JobHttpController', () => {
  let controller: JobHttpController;
  let jobService: JobService;

  const mockJobService = {
    getJobOfferList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobHttpController],
      providers: [
        {
          provide: JobService,
          useValue: mockJobService,
        },
      ],
    }).compile();

    controller = module.get<JobHttpController>(JobHttpController);
    jobService = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getJobsList', () => {
    it('should call jobService.getJobOfferList and return a formatted paginated result', async () => {
      const queries: GetJobOffersRequestQueries = {
        page: 1,
        pageSize: 10,
      };

      const jobEntity = {
        originalId: 'orig1',
        positionTitle: 'Software Engineer',
        type: 'Full-time',
        datePosted: new Date(),
        remote: true,
        location: { state: 'CA', city: 'SF' },
        employer: { name: 'Tech Corp', website: 'tech.com', industry: 'IT' },
        requirement: { skills: ['JS', 'TS'], experienceYears: 3 },
        compensation: { salaryMin: 100, salaryMax: 200, salaryCurrency: 'USD' },
      };

      const serviceResult = new PaginatedResult([jobEntity as any], 1, { page: 1, limit: 10 });
      mockJobService.getJobOfferList.mockResolvedValue(serviceResult);

      const result = await controller.getJobsList(queries);

      expect(mockJobService.getJobOfferList).toHaveBeenCalledWith({
        limitation: { limit: 10, skip: 0 },
        sortBy: undefined,
        sortOrder: undefined,
        jobTitle: undefined,
        state: undefined,
        city: undefined,
        salaryMin: undefined,
        salaryMax: undefined,
      });

      expect(result.list.length).toBe(1);
      expect(result.list[0].positionTitle).toBe('Software Engineer');
      expect(result.total).toBe(1);
    });
  });
});
