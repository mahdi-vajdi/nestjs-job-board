import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { IJobEntity } from './job.model';

export interface ICompensation {
  job: Partial<IJobEntity>;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
}

export interface ICompensationEntity
  extends ICompensation,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
