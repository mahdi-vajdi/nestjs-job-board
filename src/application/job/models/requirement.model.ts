import { JobEntity } from '../database/postgres/entities/job.entity';
import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';

export interface IRequirement {
  experienceYears: number;
  job: Partial<JobEntity>;
  skills: string[];
}

export interface IRequirementEntity
  extends IRequirement,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
