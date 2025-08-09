import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { IRequirementEntity } from '@job/models/requirement.model';

@Entity()
export class RequirementEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'job_id', type: 'bigint' })
  jobId: string;

  @Column({ name: 'experience_years', type: 'smallint', nullable: true })
  experienceYears: number;

  @Column('text', { array: true })
  skills: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => JobEntity, (job) => job.requirement, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;

  static fromIRequirement(iRequirement: any): RequirementEntity {
    if (!iRequirement) return null;

    const requirementEntity = new RequirementEntity();

    requirementEntity.jobId = iRequirement.job.id;
    requirementEntity.experienceYears = iRequirement.experienceYears;
    requirementEntity.skills = iRequirement.skills;

    return requirementEntity;
  }

  static toIRequirementEntity(
    requirementEntity: RequirementEntity,
  ): IRequirementEntity {
    if (!requirementEntity) return null;

    return {
      id: requirementEntity.id,
      experienceYears: requirementEntity.experienceYears,
      skills: requirementEntity.skills,
      job: JobEntity.toIJobEntity(requirementEntity.job),
      createdAt: requirementEntity.createdAt,
      updatedAt: requirementEntity.updatedAt,
      deletedAt: requirementEntity.deletedAt,
    };
  }
}
