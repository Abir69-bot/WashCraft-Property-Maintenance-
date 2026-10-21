import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "commercial_pages_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "commercial_pages_hoa_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "commercial_pages_hoa_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "commercial_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hoa_headline" varchar NOT NULL,
  	"hoa_intro" varchar NOT NULL,
  	"hoa_hero_image_id" integer,
  	"hoa_hero_image_label" varchar,
  	"hoa_meta_title" varchar,
  	"hoa_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "commercial_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  ALTER TABLE "service_categories" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "_service_categories_v" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "cities_neighborhoods" ADD COLUMN "image_id" integer;
  ALTER TABLE "cities" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "_cities_v_version_neighborhoods" ADD COLUMN "image_id" integer;
  ALTER TABLE "_cities_v" ADD COLUMN "version_hero_image_id" integer;
  ALTER TABLE "commercial_pages_points" ADD CONSTRAINT "commercial_pages_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commercial_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commercial_pages_hoa_sections" ADD CONSTRAINT "commercial_pages_hoa_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commercial_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commercial_pages_hoa_faqs" ADD CONSTRAINT "commercial_pages_hoa_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commercial_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commercial_pages" ADD CONSTRAINT "commercial_pages_hoa_hero_image_id_media_id_fk" FOREIGN KEY ("hoa_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commercial_pages_rels" ADD CONSTRAINT "commercial_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."commercial_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commercial_pages_rels" ADD CONSTRAINT "commercial_pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "commercial_pages_points_order_idx" ON "commercial_pages_points" USING btree ("_order");
  CREATE INDEX "commercial_pages_points_parent_id_idx" ON "commercial_pages_points" USING btree ("_parent_id");
  CREATE INDEX "commercial_pages_hoa_sections_order_idx" ON "commercial_pages_hoa_sections" USING btree ("_order");
  CREATE INDEX "commercial_pages_hoa_sections_parent_id_idx" ON "commercial_pages_hoa_sections" USING btree ("_parent_id");
  CREATE INDEX "commercial_pages_hoa_faqs_order_idx" ON "commercial_pages_hoa_faqs" USING btree ("_order");
  CREATE INDEX "commercial_pages_hoa_faqs_parent_id_idx" ON "commercial_pages_hoa_faqs" USING btree ("_parent_id");
  CREATE INDEX "commercial_pages_hoa_hoa_hero_image_idx" ON "commercial_pages" USING btree ("hoa_hero_image_id");
  CREATE INDEX "commercial_pages_rels_order_idx" ON "commercial_pages_rels" USING btree ("order");
  CREATE INDEX "commercial_pages_rels_parent_idx" ON "commercial_pages_rels" USING btree ("parent_id");
  CREATE INDEX "commercial_pages_rels_path_idx" ON "commercial_pages_rels" USING btree ("path");
  CREATE INDEX "commercial_pages_rels_services_id_idx" ON "commercial_pages_rels" USING btree ("services_id");
  ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_categories_v" ADD CONSTRAINT "_service_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_neighborhoods" ADD CONSTRAINT "cities_neighborhoods_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cities_v_version_neighborhoods" ADD CONSTRAINT "_cities_v_version_neighborhoods_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cities_v" ADD CONSTRAINT "_cities_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_categories_hero_image_idx" ON "service_categories" USING btree ("hero_image_id");
  CREATE INDEX "_service_categories_v_version_version_hero_image_idx" ON "_service_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "cities_neighborhoods_image_idx" ON "cities_neighborhoods" USING btree ("image_id");
  CREATE INDEX "cities_hero_image_idx" ON "cities" USING btree ("hero_image_id");
  CREATE INDEX "_cities_v_version_neighborhoods_image_idx" ON "_cities_v_version_neighborhoods" USING btree ("image_id");
  CREATE INDEX "_cities_v_version_version_hero_image_idx" ON "_cities_v" USING btree ("version_hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "commercial_pages_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commercial_pages_hoa_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commercial_pages_hoa_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commercial_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commercial_pages_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "commercial_pages_points" CASCADE;
  DROP TABLE "commercial_pages_hoa_sections" CASCADE;
  DROP TABLE "commercial_pages_hoa_faqs" CASCADE;
  DROP TABLE "commercial_pages" CASCADE;
  DROP TABLE "commercial_pages_rels" CASCADE;
  ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_hero_image_id_media_id_fk";
  
  ALTER TABLE "_service_categories_v" DROP CONSTRAINT "_service_categories_v_version_hero_image_id_media_id_fk";
  
  ALTER TABLE "cities_neighborhoods" DROP CONSTRAINT "cities_neighborhoods_image_id_media_id_fk";
  
  ALTER TABLE "cities" DROP CONSTRAINT "cities_hero_image_id_media_id_fk";
  
  ALTER TABLE "_cities_v_version_neighborhoods" DROP CONSTRAINT "_cities_v_version_neighborhoods_image_id_media_id_fk";
  
  ALTER TABLE "_cities_v" DROP CONSTRAINT "_cities_v_version_hero_image_id_media_id_fk";
  
  DROP INDEX "service_categories_hero_image_idx";
  DROP INDEX "_service_categories_v_version_version_hero_image_idx";
  DROP INDEX "cities_neighborhoods_image_idx";
  DROP INDEX "cities_hero_image_idx";
  DROP INDEX "_cities_v_version_neighborhoods_image_idx";
  DROP INDEX "_cities_v_version_version_hero_image_idx";
  ALTER TABLE "service_categories" DROP COLUMN "hero_image_id";
  ALTER TABLE "_service_categories_v" DROP COLUMN "version_hero_image_id";
  ALTER TABLE "cities_neighborhoods" DROP COLUMN "image_id";
  ALTER TABLE "cities" DROP COLUMN "hero_image_id";
  ALTER TABLE "_cities_v_version_neighborhoods" DROP COLUMN "image_id";
  ALTER TABLE "_cities_v" DROP COLUMN "version_hero_image_id";`)
}
