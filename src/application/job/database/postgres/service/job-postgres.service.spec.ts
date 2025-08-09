import { Test, TestingModule } from '@nestjs/testing';
import { JobPostgresService } from './job-postgres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployerEntity } from '../entities/employer.entity';
import { DataSource, Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { JobEntity } from '../entities/job.entity';
import { CompensationEntity } from '../entities/compensation.entity';
import { RequirementEntity } from '../entities/requirement.entity';
import { DatabaseType } from '@infrastructure/database/database-type.enum';

describe('JobPostgresService', () => {
  let service: JobPostgresService;
  let employerRepository: Repository<EmployerEntity>;
  let locationRepository: Repository<LocationEntity>;
  let jobRepository: Repository<JobEntity>;
  let compensationRepository: Repository<CompensationEntity>;
  let requirementRepository: Repository<RequirementEntity>;
  let dataSource: DataSource;

  const mockEmployerRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockLocationRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockJobRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCompensationRepository = {
    save: jest.fn(),
  };

  const mockRequirementRepository = {
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPostgresService,
        {
          provide: getRepositoryToken(EmployerEntity, DatabaseType.POSTGRES),
          useValue: mockEmployerRepository,
        },
        {
          provide: getRepositoryToken(LocationEntity, DatabaseType.POSTGRES),
          useValue: mockLocationRepository,
        },
        {
          provide: getRepositoryToken(JobEntity, DatabaseType.POSTGRES),
          useValue: mockJobRepository,
        },
        {
          provide: getRepositoryToken(CompensationEntity, DatabaseType.POSTGRES),
          useValue: mockCompensationRepository,
        },
        {
          provide: getRepositoryToken(RequirementEntity, DatabaseType.POSTGRES),
          useValue: mockRequirementRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<JobPostgresService>(JobPostgresService);
    employerRepository = module.get<Repository<EmployerEntity>>(
      getRepositoryToken(EmployerEntity, DatabaseType.POSTGRES),
    );
    locationRepository = module.get<Repository<LocationEntity>>(
      getRepositoryToken(LocationEntity, DatabaseType.POSTGRES),
    );
    jobRepository = module.get<Repository<JobEntity>>(
      getRepositoryToken(JobEntity, DatabaseType.POSTGRES),
    );
    compensationRepository = module.get<Repository<CompensationEntity>>(
      getRepositoryToken(CompensationEntity, DatabaseType.POSTGRES),
    );
    requirementRepository = module.get<Repository<RequirementEntity>>(
      getRepositoryToken(RequirementEntity, DatabaseType.POSTGRES),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
