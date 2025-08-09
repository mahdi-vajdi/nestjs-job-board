import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1754775897204 implements MigrationInterface {
  name = 'InitDatabase1754775897204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "employer_entity" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "industry" character varying(255), "website" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_fdad5b437b683c02163bd167db6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcd135675ea7e5c2c006727705" ON "employer_entity" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "compensation_entity" ("id" SERIAL NOT NULL, "job_id" integer NOT NULL, "salary_min" integer NOT NULL, "salary_max" integer NOT NULL, "salary_currency" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_39738584ede222f856281cb7cf" UNIQUE ("job_id"), CONSTRAINT "PK_abd621039224e4afe78d9d0cd73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6b9a0a139d0a7d75605dbbaf29" ON "compensation_entity" ("salary_min") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f03c1f5390e7e36595ec004f3" ON "compensation_entity" ("salary_max") `,
    );
    await queryRunner.query(
      `CREATE TABLE "location_entity" ("id" SERIAL NOT NULL, "city" character varying(255) NOT NULL, "state" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e276f3c240356399209b676d34e" UNIQUE ("city", "state"), CONSTRAINT "PK_9debf81cdf142d284fce9b8fd7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5738f436760559f77a09a66ae5" ON "location_entity" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1b34eb34eaf4561f6d8c6dc9d" ON "location_entity" ("state") `,
    );
    await queryRunner.query(`CREATE TABLE "job_entity"
                                 (
                                   "id"              SERIAL                 NOT NULL,
                                   "originalId"      character varying(191) NOT NULL,
                                   "employer_id"     integer                NOT NULL,
                                   "compensation_id" integer                NOT NULL,
                                   "requirement_id"  integer                NOT NULL,
                                   "location_id"     integer                NOT NULL,
                                   "position_title"  character varying(255) NOT NULL,
                                   "type"            character varying(50)  NOT NULL,
                                   "date_posted"     TIMESTAMP              NOT NULL,
                                   "remote"          boolean,
                                   "created_at"      TIMESTAMP              NOT NULL DEFAULT now(),
                                   "updated_at"      TIMESTAMP              NOT NULL DEFAULT now(),
                                   "deleted_at"      TIMESTAMP,
                                   CONSTRAINT "UQ_d4524ce7a58846f57f80bb02fe3" UNIQUE ("originalId"),
                                   CONSTRAINT "REL_5c8af798a87b47fc052700013e" UNIQUE ("compensation_id"),
                                   CONSTRAINT "REL_3cabb4aa725dedfa83e88a6c41" UNIQUE ("requirement_id"),
                                   CONSTRAINT "PK_d9fa8592dba62162a7e8636c739" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_d4524ce7a58846f57f80bb02fe" ON "job_entity" ("originalId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f3a26e5c0874e4b53a2ff9ad4f" ON "job_entity" ("position_title") `,
    );
    await queryRunner.query(
      `CREATE TABLE "requirement_entity" ("id" SERIAL NOT NULL, "job_id" integer NOT NULL, "experience_years" smallint, "skills" text array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_66b548e6d020b7a56a358fba31" UNIQUE ("job_id"), CONSTRAINT "PK_3a4a3e7fc0d4da5e54ef420f0f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_entity" ADD CONSTRAINT "FK_39738584ede222f856281cb7cfe" FOREIGN KEY ("job_id") REFERENCES "job_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" ADD CONSTRAINT "FK_dde36044b09b9a00a89e18127b4" FOREIGN KEY ("employer_id") REFERENCES "employer_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" ADD CONSTRAINT "FK_5c8af798a87b47fc052700013e2" FOREIGN KEY ("compensation_id") REFERENCES "compensation_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" ADD CONSTRAINT "FK_3cabb4aa725dedfa83e88a6c416" FOREIGN KEY ("requirement_id") REFERENCES "requirement_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" ADD CONSTRAINT "FK_99c33e8175e52a84b571c331f4e" FOREIGN KEY ("location_id") REFERENCES "location_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "requirement_entity" ADD CONSTRAINT "FK_66b548e6d020b7a56a358fba319" FOREIGN KEY ("job_id") REFERENCES "job_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requirement_entity" DROP CONSTRAINT "FK_66b548e6d020b7a56a358fba319"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" DROP CONSTRAINT "FK_99c33e8175e52a84b571c331f4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" DROP CONSTRAINT "FK_3cabb4aa725dedfa83e88a6c416"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" DROP CONSTRAINT "FK_5c8af798a87b47fc052700013e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_entity" DROP CONSTRAINT "FK_dde36044b09b9a00a89e18127b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "compensation_entity" DROP CONSTRAINT "FK_39738584ede222f856281cb7cfe"`,
    );
    await queryRunner.query(`DROP TABLE "requirement_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f3a26e5c0874e4b53a2ff9ad4f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4524ce7a58846f57f80bb02fe"`,
    );
    await queryRunner.query(`DROP TABLE "job_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e1b34eb34eaf4561f6d8c6dc9d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5738f436760559f77a09a66ae5"`,
    );
    await queryRunner.query(`DROP TABLE "location_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f03c1f5390e7e36595ec004f3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6b9a0a139d0a7d75605dbbaf29"`,
    );
    await queryRunner.query(`DROP TABLE "compensation_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcd135675ea7e5c2c006727705"`,
    );
    await queryRunner.query(`DROP TABLE "employer_entity"`);
  }
}
