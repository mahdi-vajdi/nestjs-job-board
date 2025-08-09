import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { IJobEntity } from './job.model';

export interface ILocation {
  city: string;
  state: string;
  jobs?: Partial<IJobEntity>[];
}

export interface ILocationEntity
  extends ILocation,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
