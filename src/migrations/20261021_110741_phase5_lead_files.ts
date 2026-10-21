import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lead_files" ADD COLUMN "size" numeric NOT NULL;
  ALTER TABLE "lead_files" ADD COLUMN "key" varchar NOT NULL;
  CREATE UNIQUE INDEX "lead_files_key_idx" ON "lead_files" USING btree ("key");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "lead_files_key_idx";
  ALTER TABLE "lead_files" DROP COLUMN "size";
  ALTER TABLE "lead_files" DROP COLUMN "key";`)
}
