import { Injectable, Logger } from '@nestjs/common';
import {
  JobDatabaseReader,
  JobDatabaseWriter,
} from '../../providers/jobs-database.provider';
import { ILocation, ILocationEntity } from '../../../models/location.model';
import { IEmployer, IEmployerEntity } from '../../../models/employer.entity';
import { ICompensation } from '../../../models/compensation.model';
import { IJob, IJobEntity } from '../../../models/job.model';
import { IRequirement } from '../../../models/requirement.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity } from '../entities/employer.entity';
import { DataSource, Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { JobEntity } from '../entities/job.entity';
import { CompensationEntity } from '../entities/compensation.entity';
import { RequirementEntity } from '../entities/requirement.entity';
import { DatabaseType } from '@infrastructure/database/database-type.enum';
import {
  GetJobOfferListOptions,
  GetJobOfferListSortBy,
} from '@job/database/providers/options/get-job-offer-list.options';
import { SortOrder } from '@common/enums/sort-order.enum';

@Injectable()
export class JobPostgresService
  implements JobDatabaseReader, JobDatabaseWriter
{
  private readonly logger = new Logger(JobPostgresService.name);

  constructor(
    @InjectRepository(EmployerEntity, DatabaseType.POSTGRES)
    private readonly employerRepository: Repository<EmployerEntity>,
    @InjectRepository(LocationEntity, DatabaseType.POSTGRES)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(JobEntity, DatabaseType.POSTGRES)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(CompensationEntity, DatabaseType.POSTGRES)
    private readonly compensationRepository: Repository<CompensationEntity>,
    @InjectRepository(RequirementEntity, DatabaseType.POSTGRES)
    private readonly requirementsRepository: Repository<RequirementEntity>,
    @InjectDataSource(DatabaseType.POSTGRES)
    private readonly dataSource: DataSource,
  ) {}

  async createEmployer(iEmployer: IEmployer): Promise<IEmployerEntity> {
    try {
      const employer = await this.employerRepository.save(
        EmployerEntity.fromIEmployer(iEmployer),
      );

      return EmployerEntity.toIEmployerEntity(employer);
    } catch (e) {
      this.logger.error(`error creating employer: ${e}`);
      throw e;
    }
  }

  async createLocation(iLocation: ILocation): Promise<ILocation> {
    try {
      const location = await this.locationRepository.save(
        LocationEntity.fromILocation(iLocation),
      );

      return LocationEntity.toILocationEntity(location);
    } catch (e) {
      this.logger.error(`error creating location: ${e}`);
      throw e;
    }
  }

  async getEmployer(name: string): Promise<IEmployerEntity> {
    try {
      const employer = await this.employerRepository
        .createQueryBuilder('e')
        .where('e.name = :name', { name })
        .getOne();

      return EmployerEntity.toIEmployerEntity(employer);
    } catch (e) {
      this.logger.error(`error getting employer by name ${name}: ${e}`);
      throw e;
    }
  }

  async getLocation(state: string, city: string): Promise<ILocationEntity> {
    try {
      const location = await this.locationRepository
        .createQueryBuilder('l')
        .where('l.state = :state', { state })
        .andWhere('l.city = :city', { city })
        .getOne();

      return LocationEntity.toILocationEntity(location);
    } catch (e) {
      this.logger.error(
        `error getting location by state ${state} and city ${city}: ${e}`,
      );
      throw e;
    }
  }

  async createJob(
    iJob: IJob,
    iRequirement: IRequirement,
    iCompensation: ICompensation,
  ): Promise<IJobEntity> {
    return await this.dataSource.transaction(async (entityManager) => {
      try {
        const getJob = await entityManager
          .getRepository(JobEntity)
          .createQueryBuilder('j')
          .leftJoinAndSelect('j.requirement', 'r')
          .leftJoinAndSelect('j.compensation', 'c')
          .where('j.originalId = :originalId', { originalId: iJob.originalId })
          .getOne();

        if (getJob) {
          return getJob;
        }

        const createJob = await entityManager
          .getRepository(JobEntity)
          .save(JobEntity.fromIJob(iJob));

        iRequirement.job.id = createJob.id;
        iCompensation.job.id = createJob.id;

        const [requirement, compensation] = await Promise.all([
          entityManager
            .getRepository(RequirementEntity)
            .save(RequirementEntity.fromIRequirement(iRequirement)),
          entityManager
            .getRepository(CompensationEntity)
            .save(CompensationEntity.fromICompensation(iCompensation)),
        ]);

        createJob.requirement = requirement;
        createJob.compensation = compensation;

        return JobEntity.toIJobEntity(createJob);
      } catch (e) {
        this.logger.error(`error creating job: ${e}`);
        throw e;
      }
    });
  }

  async getJobOfferList(
    options: GetJobOfferListOptions,
  ): Promise<[IJobEntity[], number]> {
    try {
      const query = this.jobRepository
        .createQueryBuilder('j')
        .leftJoinAndSelect('j.compensation', 'c')
        .leftJoinAndSelect('j.location', 'l')
        .leftJoinAndSelect('j.employer', 'e')
        .leftJoinAndSelect('j.requirement', 'r');

      if (options.jobTitle) {
        query.andWhere('j.positionTitle = :jobTitle', {
          jobTitle: options.jobTitle,
        });
      }

      if (options.salaryMin) {
        query.andWhere('c.salary_min > :salaryMin', {
          salaryMin: options.salaryMin,
        });
      }

      if (options.salaryMax) {
        query.andWhere('c.salary_max < :salaryMax', {
          salaryMax: options.salaryMax,
        });
      }

      if (options.state) {
        query.andWhere('l.state = :state', { state: options.state });
      }

      if (options.city) {
        query.andWhere('l.city = :city', { city: options.city });
      }

      if (options.sortBy) {
        const sortOder = options.sortOrder ?? SortOrder.DESC;
        switch (options.sortBy) {
          case GetJobOfferListSortBy.DATE:
            query.orderBy('j.date_posted', sortOder);
            break;
          case GetJobOfferListSortBy.SALARY:
            if (sortOder == 'DESC') query.orderBy('c.salary_max', sortOder);
            else query.orderBy('c.salary_min', sortOder);
            break;
        }
      }

      if (options.limitation) {
        query.offset(options.limitation.skip).limit(options.limitation.limit);
      }

      const [res, count] = await query.getManyAndCount();

      return [res.map((job) => JobEntity.toIJobEntity(job)), count];
    } catch (e) {
      this.logger.error(`error getting job offers list: ${e}`);
      throw e;
    }
  }
}
