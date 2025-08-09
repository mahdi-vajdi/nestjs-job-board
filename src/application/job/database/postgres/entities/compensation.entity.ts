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
import {
  ICompensation,
  ICompensationEntity,
} from '@job/models/compensation.model';

@Entity()
export class CompensationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'job_id', type: 'bigint' })
  jobId: string;

  @Column({ name: 'salary_min', type: 'int' })
  @Index()
  salaryMin: number;

  @Column({ name: 'salary_max', type: 'int' })
  @Index()
  salaryMax: number;

  @Column({ name: 'salary_currency', type: 'varchar', length: 10 })
  salaryCurrency: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => JobEntity, (job) => job.compensation)
  @JoinColumn({ name: 'job_id' })
  job: JobEntity;

  static fromICompensation(iCompensation: ICompensation): CompensationEntity {
    if (!iCompensation) return null;

    const compensationEntity = new CompensationEntity();

    compensationEntity.jobId = iCompensation.job.id;
    compensationEntity.salaryMin = iCompensation.salaryMin;
    compensationEntity.salaryMax = iCompensation.salaryMax;
    compensationEntity.salaryCurrency = iCompensation.salaryCurrency;

    return compensationEntity;
  }

  static toICompensationEntity(
    compensationEntity: CompensationEntity,
  ): ICompensationEntity {
    if (!compensationEntity) return null;

    return {
      id: compensationEntity.id,
      salaryMin: compensationEntity.salaryMin,
      salaryMax: compensationEntity.salaryMax,
      salaryCurrency: compensationEntity.salaryCurrency,
      job: compensationEntity.job
        ? JobEntity.toIJobEntity(compensationEntity.job)
        : {
            id: compensationEntity.jobId,
          },
      createdAt: compensationEntity.createdAt,
      updatedAt: compensationEntity.updatedAt,
      deletedAt: compensationEntity.deletedAt,
    };
  }
}
