import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"hero_image_id" integer,
  	"hero_image_label" varchar,
  	"story" varchar,
  	"mission" varchar,
  	"community" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "careers_page_why_work_here" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "careers_page_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "careers_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"privacy_updated" timestamp(3) with time zone NOT NULL,
  	"privacy" jsonb NOT NULL,
  	"terms_updated" timestamp(3) with time zone NOT NULL,
  	"terms" jsonb NOT NULL,
  	"accessibility_updated" timestamp(3) with time zone NOT NULL,
  	"accessibility" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "google_rating" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "google_review_count" numeric;
  ALTER TABLE "site_settings" ADD COLUMN "google_synced_at" timestamp(3) with time zone;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_certificates" ADD CONSTRAINT "about_page_certificates_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_certificates" ADD CONSTRAINT "about_page_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_page_why_work_here" ADD CONSTRAINT "careers_page_why_work_here_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_page_benefits" ADD CONSTRAINT "careers_page_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE INDEX "about_page_certificates_order_idx" ON "about_page_certificates" USING btree ("_order");
  CREATE INDEX "about_page_certificates_parent_id_idx" ON "about_page_certificates" USING btree ("_parent_id");
  CREATE INDEX "about_page_certificates_file_idx" ON "about_page_certificates" USING btree ("file_id");
  CREATE INDEX "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "careers_page_why_work_here_order_idx" ON "careers_page_why_work_here" USING btree ("_order");
  CREATE INDEX "careers_page_why_work_here_parent_id_idx" ON "careers_page_why_work_here" USING btree ("_parent_id");
  CREATE INDEX "careers_page_benefits_order_idx" ON "careers_page_benefits" USING btree ("_order");
  CREATE INDEX "careers_page_benefits_parent_id_idx" ON "careers_page_benefits" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_certificates" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "careers_page_why_work_here" CASCADE;
  DROP TABLE "careers_page_benefits" CASCADE;
  DROP TABLE "careers_page" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "google_rating";
  ALTER TABLE "site_settings" DROP COLUMN "google_review_count";
  ALTER TABLE "site_settings" DROP COLUMN "google_synced_at";`)
}
