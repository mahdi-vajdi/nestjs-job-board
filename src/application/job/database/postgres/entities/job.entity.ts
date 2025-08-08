import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

@Entity()
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 191, unique: true })
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
}
