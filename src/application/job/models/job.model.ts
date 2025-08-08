import { IdentifiableEntity } from '@common/entities/identifiable-entity.interface';
import { TimestampedEntity } from '@common/entities/timestamped-entity.interface';
import { SoftDeletableEntity } from '@common/entities/soft-deletable-entity.interface';
import { ICompensationEntity } from './compensation.model';
import { IRequirementEntity } from './requirement.model';
import { ILocationEntity } from './location.model';
import { IEmployerEntity } from './employer.entity';

export interface IJob {
  originalId: string;
  positionTitle: string;
  type: string;
  datePosted: Date;
  remote: boolean | null;
  employer: Partial<IEmployerEntity>;
  compensation: Partial<ICompensationEntity>;
  requirement: Partial<IRequirementEntity>;
  location: Partial<ILocationEntity>;
}

export interface IJobEntity
  extends IJob,
    IdentifiableEntity,
    TimestampedEntity,
    SoftDeletableEntity {}
