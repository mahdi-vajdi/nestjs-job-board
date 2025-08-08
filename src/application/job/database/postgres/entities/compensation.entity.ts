import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity()
export class CompensationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'job_id', type: 'bigint' })
  jobId: string;

  @Column({ name: 'salary_min', type: 'int' })
  salaryMin: number;

  @Column({ name: 'salary_max', type: 'int' })
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
}
