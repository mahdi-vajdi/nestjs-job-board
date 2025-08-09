import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import {
  JOB_DATABASE_READER_TOKEN,
  JOB_DATABASE_WRITER_TOKEN,
  JobDatabaseReader,
  JobDatabaseWriter,
} from '../database/providers/jobs-database.provider';
import {
  ExternalApiProvider,
  SOURCE_1_PROVIDER,
  SOURCE_2_PROVIDER,
} from '../query-client/providers/external-api.provider';
import { IEmployer, IEmployerEntity } from '../models/employer.entity';
import { ILocation } from '../models/location.model';
import { GetJobOfferList } from './dto/get-job-offer-list.dto';
import { IJobEntity } from '@job/models/job.model';
import { PaginatedResult } from '@common/pagination/paginated-result';
import { ExternalJob } from '@job/query-client/models/external-api-job.model';

describe('JobService', () => {
  let service: JobService;
  let source1ApiProvider: ExternalApiProvider;
  let source2ApiProvider: ExternalApiProvider;
  let jobDatabaseReader: JobDatabaseReader;
  let jobDatabaseWriter: JobDatabaseWriter;

  const mockSource1ApiProvider = {
    getJobs: jest.fn(),
  };

  const mockSource2ApiProvider = {
    getJobs: jest.fn(),
  };

  const mockJobDatabaseReader = {
    getJobOfferList: jest.fn(),
    getEmployer: jest.fn(),
    getLocation: jest.fn(),
  };

  const mockJobDatabaseWriter = {
    createJob: jest.fn(),
    createEmployer: jest.fn(),
    createLocation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: SOURCE_1_PROVIDER,
          useValue: mockSource1ApiProvider,
        },
        {
          provide: SOURCE_2_PROVIDER,
          useValue: mockSource2ApiProvider,
        },
        {
          provide: JOB_DATABASE_READER_TOKEN,
          useValue: mockJobDatabaseReader,
        },
        {
          provide: JOB_DATABASE_WRITER_TOKEN,
          useValue: mockJobDatabaseWriter,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    source1ApiProvider = module.get<ExternalApiProvider>(SOURCE_1_PROVIDER);
    source2ApiProvider = module.get<ExternalApiProvider>(SOURCE_2_PROVIDER);
    jobDatabaseReader = module.get<JobDatabaseReader>(
      JOB_DATABASE_READER_TOKEN,
    );
    jobDatabaseWriter = module.get<JobDatabaseWriter>(
      JOB_DATABASE_WRITER_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateLocation', () => {
    it('should return existing location if found', async () => {
      const location: ILocation = { state: 'California', city: 'LA' };
      mockJobDatabaseReader.getLocation.mockResolvedValue(location);

      const result = await service.getOrCreateLocation(location);

      expect(result).toEqual(location);
      expect(mockJobDatabaseReader.getLocation).toHaveBeenCalledWith(
        location.state,
        location.city,
      );
      expect(mockJobDatabaseWriter.createLocation).not.toHaveBeenCalled();
    });

    it('should create a new location if not found', async () => {
      const location: ILocation = { state: 'California', city: 'SF' };
      mockJobDatabaseReader.getLocation.mockResolvedValue(null);
      mockJobDatabaseWriter.createLocation.mockResolvedValue(location);

      const result = await service.getOrCreateLocation(location);

      expect(result).toEqual(location);
      expect(mockJobDatabaseReader.getLocation).toHaveBeenCalledWith(
        location.state,
        location.city,
      );
      expect(mockJobDatabaseWriter.createLocation).toHaveBeenCalledWith(
        location,
      );
    });
  });

  describe('getOrCreateEmployer', () => {
    it('should return existing employer if found', async () => {
      const employer: IEmployer = {
        name: 'Google',
        industry: 'Tech',
        website: 'google.com',
      };
      const employerEntity: IEmployerEntity = { ...employer, id: '1' };
      mockJobDatabaseReader.getEmployer.mockResolvedValue(employerEntity);

      const result = await service.getOrCreateEmployer(employer);

      expect(result).toEqual(employerEntity);
      expect(mockJobDatabaseReader.getEmployer).toHaveBeenCalledWith(
        employer.name,
      );
      expect(mockJobDatabaseWriter.createEmployer).not.toHaveBeenCalled();
    });

    it('should create a new employer if not found', async () => {
      const employer: IEmployer = {
        name: 'Facebook',
        industry: 'Tech',
        website: 'fb.com',
      };
      const employerEntity: IEmployerEntity = { ...employer, id: '2' };
      mockJobDatabaseReader.getEmployer.mockResolvedValue(null);
      mockJobDatabaseWriter.createEmployer.mockResolvedValue(employerEntity);

      const result = await service.getOrCreateEmployer(employer);

      expect(result).toEqual(employerEntity);
      expect(mockJobDatabaseReader.getEmployer).toHaveBeenCalledWith(
        employer.name,
      );
      expect(mockJobDatabaseWriter.createEmployer).toHaveBeenCalledWith(
        employer,
      );
    });
  });

  describe('getJobOfferList', () => {
    it('should return a paginated list of job offers', async () => {
      const dto: GetJobOfferList = {
        limitation: { page: 1, limit: 10 },
      };
      const jobs: IJobEntity[] = [
        { id: '1', positionTitle: 'SWE' } as IJobEntity,
      ];
      const count = 1;
      mockJobDatabaseReader.getJobOfferList.mockResolvedValue([jobs, count]);

      const result = await service.getJobOfferList(dto);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.data).toEqual(jobs);
      expect(result.total).toEqual(count);
      expect(mockJobDatabaseReader.getJobOfferList).toHaveBeenCalledWith({
        limitation: dto.limitation,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
        state: dto.state,
        city: dto.city,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
      });
    });
  });

  describe('processJobsFromExternalApis', () => {
    it('should process jobs from external APIs and save them to the database', async () => {
      const externalJob: ExternalJob = {
        details: {
          id: 'ext1',
          positionTitle: 'Software Engineer',
          type: 'Full-time',
          datePosted: new Date(),
          remote: true,
        },
        location: { state: 'California', city: 'Mountain View' },
        employer: { name: 'Google', industry: 'Tech', website: 'google.com' },
        requirements: { skills: ['JS', 'TS'], experience: 5 },
        compensation: {
          salaryMin: 100000,
          salaryMax: 150000,
          salaryCurrency: 'USD',
        },
      };

      mockSource1ApiProvider.getJobs.mockResolvedValue([externalJob]);
      mockSource2ApiProvider.getJobs.mockResolvedValue([]);

      const location = { ...externalJob.location, id: 'loc1' };
      const employer = { ...externalJob.employer, id: 'emp1' };

      // Mock getOrCreate calls
      jest.spyOn(service, 'getOrCreateLocation').mockResolvedValue(location);
      jest.spyOn(service, 'getOrCreateEmployer').mockResolvedValue(employer);

      await service.processJobsFromExternalApis();

      expect(mockSource1ApiProvider.getJobs).toHaveBeenCalled();
      expect(mockSource2ApiProvider.getJobs).toHaveBeenCalled();
      expect(service.getOrCreateLocation).toHaveBeenCalledWith(
        externalJob.location,
      );
      expect(service.getOrCreateEmployer).toHaveBeenCalledWith(
        externalJob.employer,
      );
      expect(mockJobDatabaseWriter.createJob).toHaveBeenCalledWith(
        {
          originalId: externalJob.details.id,
          positionTitle: externalJob.details.positionTitle,
          type: externalJob.details.type,
          datePosted: externalJob.details.datePosted,
          remote: externalJob.details.remote,
          location: location,
          employer: employer,
        },
        {
          job: null,
          skills: externalJob.requirements.skills,
          experienceYears: externalJob.requirements.experience,
        },
        {
          job: null,
          salaryMin: externalJob.compensation.salaryMin,
          salaryMax: externalJob.compensation.salaryMax,
          salaryCurrency: externalJob.compensation.salaryCurrency,
        },
      );
    });
  });
});
