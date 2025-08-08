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
}
