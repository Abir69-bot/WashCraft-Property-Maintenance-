import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_frequencies" AS ENUM('one-time', 'twice-yearly', 'quarterly', 'monthly');
  CREATE TYPE "public"."enum__services_v_version_frequencies" AS ENUM('one-time', 'twice-yearly', 'quarterly', 'monthly');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TABLE "services_frequencies" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_frequencies",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_v_version_frequencies" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_v_version_frequencies",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'leads' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seasonal_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  DROP INDEX "lead_files_filename_idx";
  ALTER TABLE "lead_files" ALTER COLUMN "filename" SET NOT NULL;
  ALTER TABLE "lead_files" ALTER COLUMN "mime_type" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "leads" ADD COLUMN "plan_id" integer;
  ALTER TABLE "leads" ADD COLUMN "callback_requested" boolean;
  ALTER TABLE "seasonal_settings" ADD COLUMN "snow_payment_note" varchar;
  ALTER TABLE "services_frequencies" ADD CONSTRAINT "services_frequencies_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_frequencies" ADD CONSTRAINT "_services_v_version_frequencies_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasonal_settings_texts" ADD CONSTRAINT "seasonal_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."seasonal_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_frequencies_order_idx" ON "services_frequencies" USING btree ("order");
  CREATE INDEX "services_frequencies_parent_idx" ON "services_frequencies" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_frequencies_order_idx" ON "_services_v_version_frequencies" USING btree ("order");
  CREATE INDEX "_services_v_version_frequencies_parent_idx" ON "_services_v_version_frequencies" USING btree ("parent_id");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "seasonal_settings_texts_order_parent" ON "seasonal_settings_texts" USING btree ("order","parent_id");
  ALTER TABLE "leads" ADD CONSTRAINT "leads_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leads_plan_idx" ON "leads" USING btree ("plan_id");
  ALTER TABLE "lead_files" DROP COLUMN "url";
  ALTER TABLE "lead_files" DROP COLUMN "thumbnail_u_r_l";
  ALTER TABLE "lead_files" DROP COLUMN "filesize";
  ALTER TABLE "lead_files" DROP COLUMN "width";
  ALTER TABLE "lead_files" DROP COLUMN "height";
  ALTER TABLE "lead_files" DROP COLUMN "focal_x";
  ALTER TABLE "lead_files" DROP COLUMN "focal_y";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_frequencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_frequencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "exports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "exports_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "imports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seasonal_settings_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_frequencies" CASCADE;
  DROP TABLE "_services_v_version_frequencies" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "seasonal_settings_texts" CASCADE;
  ALTER TABLE "leads" DROP CONSTRAINT "leads_plan_id_plans_id_fk";
  
  DROP INDEX "leads_plan_idx";
  ALTER TABLE "lead_files" ALTER COLUMN "filename" DROP NOT NULL;
  ALTER TABLE "lead_files" ALTER COLUMN "mime_type" DROP NOT NULL;
  ALTER TABLE "lead_files" ADD COLUMN "url" varchar;
  ALTER TABLE "lead_files" ADD COLUMN "thumbnail_u_r_l" varchar;
  ALTER TABLE "lead_files" ADD COLUMN "filesize" numeric;
  ALTER TABLE "lead_files" ADD COLUMN "width" numeric;
  ALTER TABLE "lead_files" ADD COLUMN "height" numeric;
  ALTER TABLE "lead_files" ADD COLUMN "focal_x" numeric;
  ALTER TABLE "lead_files" ADD COLUMN "focal_y" numeric;
  CREATE UNIQUE INDEX "lead_files_filename_idx" ON "lead_files" USING btree ("filename");
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "leads" DROP COLUMN "plan_id";
  ALTER TABLE "leads" DROP COLUMN "callback_requested";
  ALTER TABLE "seasonal_settings" DROP COLUMN "snow_payment_note";
  DROP TYPE "public"."enum_services_frequencies";
  DROP TYPE "public"."enum__services_v_version_frequencies";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
