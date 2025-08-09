import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployerEntity } from './employer.entity';
import { CompensationEntity } from './compensation.entity';
import { RequirementEntity } from './requirement.entity';
import { LocationEntity } from './location.entity';
import { IJob, IJobEntity } from '../../../models/job.model';

@Entity()
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 191, unique: true })
  @Index()
  originalId: string;

  @Column({ name: 'employer_id', type: 'bigint' })
  employerId: string;

  @Column({ name: 'compensation_id', type: 'bigint' })
  compensationId: string;

  @Column({ name: 'requirement_id', type: 'bigint' })
  requirementId: string;

  @Column({ name: 'location_id', type: 'bigint' })
  locationId: string;

  @Column({ name: 'position_title', type: 'varchar', length: 255 })
  @Index()
  positionTitle: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ name: 'date_posted', type: 'timestamp' })
  datePosted: Date;

  @Column({ type: 'boolean', nullable: true })
  remote: boolean | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => EmployerEntity, (employer) => employer.jobs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employer_id' })
  employer: EmployerEntity;

  @OneToOne(() => CompensationEntity, (compensation) => compensation.job, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'compensation_id' })
  compensation: CompensationEntity;

  @OneToOne(() => RequirementEntity, (requirement) => requirement.job, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requirement_id' })
  requirement: RequirementEntity;

  @ManyToOne(() => LocationEntity, (location) => location.jobs, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  static fromIJob(iJob: IJob): JobEntity {
    if (!iJob) return null;

    const jobEntity = new JobEntity();

    jobEntity.originalId = iJob.originalId;
    jobEntity.positionTitle = iJob.positionTitle;
    jobEntity.type = iJob.type;
    jobEntity.datePosted = iJob.datePosted;
    jobEntity.remote = iJob.remote;

    return jobEntity;
  }

  static toIJobEntity(jobEntity: JobEntity): IJobEntity {
    if (!jobEntity) return null;

    return {
      id: jobEntity.id,
      originalId: jobEntity.originalId,
      positionTitle: jobEntity.positionTitle,
      type: jobEntity.type,
      datePosted: jobEntity.datePosted,
      remote: jobEntity.remote,
      employer: jobEntity.employer
        ? EmployerEntity.toIEmployerEntity(jobEntity.employer)
        : {
            id: jobEntity.employerId,
          },
      compensation: jobEntity.compensation
        ? CompensationEntity.toICompensationEntity(jobEntity.compensation)
        : {
            id: jobEntity.compensationId,
          },
      requirement: jobEntity.requirement
        ? RequirementEntity.toIRequirementEntity(jobEntity.requirement)
        : {
            id: jobEntity.requirementId,
          },
      location: jobEntity.location
        ? LocationEntity.toILocationEntity(jobEntity.location)
        : {
            id: jobEntity.locationId,
          },
      createdAt: jobEntity.createdAt,
      updatedAt: jobEntity.updatedAt,
      deletedAt: jobEntity.deletedAt,
    };
  }
}
