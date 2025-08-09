import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';
import { ILocation, ILocationEntity } from '@job/models/location.model';

@Entity()
@Unique(['city', 'state'])
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  city: string;

  @Column({ type: 'varchar', length: 10 })
  @Index()
  state: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => JobEntity, (job) => job.location)
  jobs: JobEntity[];

  static fromILocation(iLocation: ILocation): LocationEntity {
    if (!iLocation) return null;

    const locationEntity = new LocationEntity();
    locationEntity.city = iLocation.city;
    locationEntity.state = iLocation.state;

    return locationEntity;
  }

  static toILocationEntity(locationEntity: LocationEntity): ILocationEntity {
    if (!locationEntity) return null;

    return {
      id: locationEntity.id,
      city: locationEntity.city,
      state: locationEntity.state,
      jobs: locationEntity.jobs.map((job) => JobEntity.toIJobEntity(job)),
      createdAt: locationEntity.createdAt,
      updatedAt: locationEntity.updatedAt,
      deletedAt: locationEntity.deletedAt,
    };
  }
}
