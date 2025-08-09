import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { IJobEntity } from './job.model';

export interface IRequirement {
  job: Partial<IJobEntity>;
  skills: string[];
  experienceYears: number;
}

export interface IRequirementEntity
  extends IRequirement,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
