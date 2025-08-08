import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { IJobEntity } from './job.model';

export interface IRequirement {
  experienceYears: number;
  job: Partial<IJobEntity>;
  skills: string[];
}

export interface IRequirementEntity
  extends IRequirement,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
