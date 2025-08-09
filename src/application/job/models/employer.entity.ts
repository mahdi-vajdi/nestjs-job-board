import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { IJobEntity } from './job.model';

export interface IEmployer {
  name: string;
  industry: string | null;
  website: string | null;
  jobs?: Partial<IJobEntity>[];
}

export interface IEmployerEntity
  extends IEmployer,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
