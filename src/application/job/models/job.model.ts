import { EmployerEntity } from '../database/postgres/entities/employer.entity';
import { CompensationEntity } from '../database/postgres/entities/compensation.entity';
import { RequirementEntity } from '../database/postgres/entities/requirement.entity';
import { LocationEntity } from '../database/postgres/entities/location.entity';
import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';

export interface IJob {
  originalId: string;
  positionTitle: string;
  type: string;
  datePosted: Date;
  remote: boolean | null;
  employer: Partial<EmployerEntity>[];
  compensation: Partial<CompensationEntity>[];
  requirement: Partial<RequirementEntity>[];
  location: Partial<LocationEntity>[];
}

export interface IJobEntity
  extends IJob,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
