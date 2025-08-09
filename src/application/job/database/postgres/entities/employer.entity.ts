import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { IEmployer, IEmployerEntity } from '@job/models/employer.entity';

@Entity()
export class EmployerEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  industry: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => JobEntity, (job) => job.employer)
  jobs: JobEntity[];

  static fromIEmployer(iEmployer: IEmployer): EmployerEntity {
    if (!iEmployer) return null;

    const employerEntity = new EmployerEntity();

    employerEntity.name = iEmployer.name;
    employerEntity.industry = iEmployer.industry;
    employerEntity.website = iEmployer.website;

    return employerEntity;
  }

  static toIEmployerEntity(employerEntity: EmployerEntity): IEmployerEntity {
    if (!employerEntity) return null;

    return {
      id: employerEntity.id,
      name: employerEntity.name,
      industry: employerEntity.industry,
      website: employerEntity.website,
      jobs: employerEntity.jobs.map((job) => JobEntity.toIJobEntity(job)),
      createdAt: employerEntity.createdAt,
      updatedAt: employerEntity.updatedAt,
      deletedAt: employerEntity.deletedAt,
    };
  }
}
