import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { DatabaseType } from '@infrastructure/database/database-type.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  JOB_DATABASE_READER_TOKEN,
  JOB_DATABASE_WRITER_TOKEN,
} from './providers/jobs-database.provider';
import { JobPostgresService } from './postgres/service/job-postgres.service';
import { JobEntity } from './postgres/entities/job.entity';
import { CompensationEntity } from './postgres/entities/compensation.entity';
import { EmployerEntity } from './postgres/entities/employer.entity';
import { LocationEntity } from './postgres/entities/location.entity';
import { RequirementEntity } from './postgres/entities/requirement.entity';

@Module({
  imports: [
    DatabaseModule.register(DatabaseType.POSTGRES),
    TypeOrmModule.forFeature(
      [
        JobEntity,
        CompensationEntity,
        EmployerEntity,
        LocationEntity,
        RequirementEntity,
      ],
      DatabaseType.POSTGRES,
    ),
  ],
  providers: [
    {
      provide: JOB_DATABASE_READER_TOKEN,
      useClass: JobPostgresService,
    },
    {
      provide: JOB_DATABASE_WRITER_TOKEN,
      useClass: JobPostgresService,
    },
  ],
  exports: [JOB_DATABASE_READER_TOKEN, JOB_DATABASE_WRITER_TOKEN],
})
export class JobDatabaseModule {}
