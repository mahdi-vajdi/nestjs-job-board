import { JobEntity } from '../database/postgres/entities/job.entity';
import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';

export interface ILocation {
  id: string;
  city: string;
  state: string;
  jobs: Partial<JobEntity>[];
}

export interface ILocationEntity
  extends ILocation,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
