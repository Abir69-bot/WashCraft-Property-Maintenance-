import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_homepage_sections_section" ADD VALUE 'intro' BEFORE 'quick-quote';
  CREATE TABLE "services_suitable_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_preparation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "_services_v_version_suitable_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_preparation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "navigation_commercial_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "navigation_commercial_links" CASCADE;
  ALTER TABLE "leads" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "header_cta_label" DROP NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "header_cta_href" DROP NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "free_quotes" boolean DEFAULT false;
  ALTER TABLE "homepage" ADD COLUMN "introduction_title" varchar;
  ALTER TABLE "homepage" ADD COLUMN "introduction_body" varchar;
  ALTER TABLE "feature_flags" ADD COLUMN "instant_pricing" boolean;
  ALTER TABLE "feature_flags" ADD COLUMN "dedicated_quote_forms" boolean;
  ALTER TABLE "feature_flags" ADD COLUMN "comparison_table" boolean;
  ALTER TABLE "services_suitable_for" ADD CONSTRAINT "services_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_exclusions" ADD CONSTRAINT "services_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_preparation" ADD CONSTRAINT "services_preparation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_suitable_for" ADD CONSTRAINT "_services_v_version_suitable_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_exclusions" ADD CONSTRAINT "_services_v_version_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_preparation" ADD CONSTRAINT "_services_v_version_preparation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_suitable_for_order_idx" ON "services_suitable_for" USING btree ("_order");
  CREATE INDEX "services_suitable_for_parent_id_idx" ON "services_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "services_exclusions_order_idx" ON "services_exclusions" USING btree ("_order");
  CREATE INDEX "services_exclusions_parent_id_idx" ON "services_exclusions" USING btree ("_parent_id");
  CREATE INDEX "services_preparation_order_idx" ON "services_preparation" USING btree ("_order");
  CREATE INDEX "services_preparation_parent_id_idx" ON "services_preparation" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_suitable_for_order_idx" ON "_services_v_version_suitable_for" USING btree ("_order");
  CREATE INDEX "_services_v_version_suitable_for_parent_id_idx" ON "_services_v_version_suitable_for" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_exclusions_order_idx" ON "_services_v_version_exclusions" USING btree ("_order");
  CREATE INDEX "_services_v_version_exclusions_parent_id_idx" ON "_services_v_version_exclusions" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_preparation_order_idx" ON "_services_v_version_preparation" USING btree ("_order");
  CREATE INDEX "_services_v_version_preparation_parent_id_idx" ON "_services_v_version_preparation" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "navigation_commercial_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  ALTER TABLE "services_suitable_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_exclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_preparation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_suitable_for" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_exclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_preparation" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_suitable_for" CASCADE;
  DROP TABLE "services_exclusions" CASCADE;
  DROP TABLE "services_preparation" CASCADE;
  DROP TABLE "_services_v_version_suitable_for" CASCADE;
  DROP TABLE "_services_v_version_exclusions" CASCADE;
  DROP TABLE "_services_v_version_preparation" CASCADE;
  ALTER TABLE "homepage_sections" ALTER COLUMN "section" SET DATA TYPE text;
  DROP TYPE "public"."enum_homepage_sections_section";
  CREATE TYPE "public"."enum_homepage_sections_section" AS ENUM('hero', 'quick-quote', 'client-logos', 'trust-strip', 'services', 'seasonal-spotlight', 'how-it-works', 'before-after', 'guarantee', 'need-us-now', 'testimonials', 'why-choose-us', 'comparison', 'commercial', 'plans', 'founder', 'service-areas', 'faq', 'articles', 'final-cta');
  ALTER TABLE "homepage_sections" ALTER COLUMN "section" SET DATA TYPE "public"."enum_homepage_sections_section" USING "section"::"public"."enum_homepage_sections_section";
  ALTER TABLE "leads" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "header_cta_label" SET NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "header_cta_href" SET NOT NULL;
  ALTER TABLE "navigation_commercial_links" ADD CONSTRAINT "navigation_commercial_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_commercial_links_order_idx" ON "navigation_commercial_links" USING btree ("_order");
  CREATE INDEX "navigation_commercial_links_parent_id_idx" ON "navigation_commercial_links" USING btree ("_parent_id");
  ALTER TABLE "site_settings" DROP COLUMN "free_quotes";
  ALTER TABLE "homepage" DROP COLUMN "introduction_title";
  ALTER TABLE "homepage" DROP COLUMN "introduction_body";
  ALTER TABLE "feature_flags" DROP COLUMN "instant_pricing";
  ALTER TABLE "feature_flags" DROP COLUMN "dedicated_quote_forms";
  ALTER TABLE "feature_flags" DROP COLUMN "comparison_table";`)
}
