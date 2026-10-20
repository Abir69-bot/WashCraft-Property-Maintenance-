import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_seasons" AS ENUM('all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('archive', 'brush', 'building', 'car', 'cloud-snow', 'construction', 'droplets', 'eraser', 'fence', 'flower', 'footprints', 'gift', 'hammer', 'house', 'lamp', 'layers', 'leaf', 'lightbulb', 'mountain', 'package', 'paint-bucket', 'paintbrush', 'parking', 'roller', 'shield', 'shovel', 'snowflake', 'solar', 'sparkles', 'spray', 'sprout', 'sun', 'thermometer-snow', 'trash', 'tree', 'truck', 'umbrella', 'warehouse', 'wind', 'window', 'wrench');
  CREATE TYPE "public"."enum_services_quote_mode" AS ENUM('instant', 'custom', 'contract', 'subscription', 'bid', 'addon');
  CREATE TYPE "public"."enum_services_dedicated_flow" AS ENUM('holiday-lights', 'junk-removal');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_seasons" AS ENUM('all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum__services_v_version_icon" AS ENUM('archive', 'brush', 'building', 'car', 'cloud-snow', 'construction', 'droplets', 'eraser', 'fence', 'flower', 'footprints', 'gift', 'hammer', 'house', 'lamp', 'layers', 'leaf', 'lightbulb', 'mountain', 'package', 'paint-bucket', 'paintbrush', 'parking', 'roller', 'shield', 'shovel', 'snowflake', 'solar', 'sparkles', 'spray', 'sprout', 'sun', 'thermometer-snow', 'trash', 'tree', 'truck', 'umbrella', 'warehouse', 'wind', 'window', 'wrench');
  CREATE TYPE "public"."enum__services_v_version_quote_mode" AS ENUM('instant', 'custom', 'contract', 'subscription', 'bid', 'addon');
  CREATE TYPE "public"."enum__services_v_version_dedicated_flow" AS ENUM('holiday-lights', 'junk-removal');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_categories_icon" AS ENUM('archive', 'brush', 'building', 'car', 'cloud-snow', 'construction', 'droplets', 'eraser', 'fence', 'flower', 'footprints', 'gift', 'hammer', 'house', 'lamp', 'layers', 'leaf', 'lightbulb', 'mountain', 'package', 'paint-bucket', 'paintbrush', 'parking', 'roller', 'shield', 'shovel', 'snowflake', 'solar', 'sparkles', 'spray', 'sprout', 'sun', 'thermometer-snow', 'trash', 'tree', 'truck', 'umbrella', 'warehouse', 'wind', 'window', 'wrench');
  CREATE TYPE "public"."enum_service_categories_tone" AS ENUM('exterior', 'interior', 'winter', 'holiday', 'yard', 'commercial');
  CREATE TYPE "public"."enum_service_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_categories_v_version_icon" AS ENUM('archive', 'brush', 'building', 'car', 'cloud-snow', 'construction', 'droplets', 'eraser', 'fence', 'flower', 'footprints', 'gift', 'hammer', 'house', 'lamp', 'layers', 'leaf', 'lightbulb', 'mountain', 'package', 'paint-bucket', 'paintbrush', 'parking', 'roller', 'shield', 'shovel', 'snowflake', 'solar', 'sparkles', 'spray', 'sprout', 'sun', 'thermometer-snow', 'trash', 'tree', 'truck', 'umbrella', 'warehouse', 'wind', 'window', 'wrench');
  CREATE TYPE "public"."enum__service_categories_v_version_tone" AS ENUM('exterior', 'interior', 'winter', 'holiday', 'yard', 'commercial');
  CREATE TYPE "public"."enum__service_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pricing_rules_unit" AS ENUM('job', 'sq_ft', 'linear_ft', 'window', 'panel', 'bin', 'item');
  CREATE TYPE "public"."enum_discounts_type" AS ENUM('bundle', 'frequency');
  CREATE TYPE "public"."enum_discounts_frequency" AS ENUM('one-time', 'twice-yearly', 'quarterly', 'monthly');
  CREATE TYPE "public"."enum_plans_kind" AS ENUM('tier', 'package');
  CREATE TYPE "public"."enum_plans_season" AS ENUM('all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum_cities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('seasonal', 'how-to', 'guides', 'news');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_category" AS ENUM('seasonal', 'how-to', 'guides', 'news');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('general', 'pricing', 'scheduling', 'exterior', 'interior', 'winter', 'holiday', 'yard', 'commercial');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('direct', 'google', 'facebook', 'nextdoor', 'other');
  CREATE TYPE "public"."enum_case_studies_property_type" AS ENUM('hoa', 'retail', 'office', 'industrial', 'parking-garage', 'multi-site');
  CREATE TYPE "public"."enum_team_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_job_openings_employment_type" AS ENUM('full-time', 'part-time', 'seasonal');
  CREATE TYPE "public"."enum_job_openings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__job_openings_v_version_employment_type" AS ENUM('full-time', 'part-time', 'seasonal');
  CREATE TYPE "public"."enum__job_openings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_leads_property_type" AS ENUM('house', 'townhouse', 'condo', 'commercial');
  CREATE TYPE "public"."enum_leads_frequency" AS ENUM('one-time', 'twice-yearly', 'quarterly', 'monthly');
  CREATE TYPE "public"."enum_leads_notification_status" AS ENUM('pending', 'sent', 'partial', 'failed');
  CREATE TYPE "public"."enum_leads_type" AS ENUM('quick', 'instant', 'custom', 'snow_contract', 'holiday_lights', 'junk', 'commercial_bid', 'subscription', 'contact');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'estimate_viewed', 'booking_requested', 'contacted', 'quoted', 'booked', 'won', 'lost');
  CREATE TYPE "public"."enum_applications_status" AS ENUM('new', 'reviewing', 'interview', 'hired', 'declined');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_site_settings_demo" AS ENUM('tagline', 'phone', 'email', 'address', 'hours', 'region', 'serviceAreas');
  CREATE TYPE "public"."enum_site_settings_country" AS ENUM('US', 'CA');
  CREATE TYPE "public"."enum_site_settings_currency" AS ENUM('USD', 'CAD');
  CREATE TYPE "public"."enum_site_settings_locale" AS ENUM('en-US', 'en-CA');
  CREATE TYPE "public"."enum_seasonal_settings_announcements_season" AS ENUM('all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_spring_start_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_spring_end_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_summer_start_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_summer_end_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_fall_start_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_fall_end_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_winter_start_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_winter_end_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_holiday_start_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_seasons_holiday_end_month" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
  CREATE TYPE "public"."enum_seasonal_settings_hero_override" AS ENUM('auto', 'all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum_homepage_sections_section" AS ENUM('hero', 'quick-quote', 'client-logos', 'trust-strip', 'services', 'seasonal-spotlight', 'how-it-works', 'before-after', 'guarantee', 'need-us-now', 'testimonials', 'why-choose-us', 'comparison', 'commercial', 'plans', 'founder', 'service-areas', 'faq', 'articles', 'final-cta');
  CREATE TYPE "public"."enum_homepage_hero_variants_season" AS ENUM('all-year', 'spring', 'summer', 'fall', 'winter', 'holiday');
  CREATE TYPE "public"."enum_pricing_settings_frequencies" AS ENUM('one-time', 'twice-yearly', 'quarterly', 'monthly');
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "services_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "services_card_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services_price_factors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"factor" varchar
  );
  
  CREATE TABLE "services_add_ons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_seasons" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_services_seasons",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"headline" varchar,
  	"promise" varchar,
  	"summary" varchar,
  	"hero_image_id" integer,
  	"hero_image_label" varchar,
  	"problem" varchar,
  	"method" varchar,
  	"safety" varchar,
  	"icon" "enum_services_icon",
  	"outcome_label" varchar,
  	"quote_mode" "enum_services_quote_mode" DEFAULT 'custom',
  	"parent_service_id" integer,
  	"dedicated_flow" "enum_services_dedicated_flow",
  	"requires_site_visit" boolean,
  	"quote_questions" jsonb DEFAULT '[]'::jsonb,
  	"from_price" numeric,
  	"booking_window_note" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"category_id" integer,
  	"enabled" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"solutions_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_services_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_included" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_card_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_price_factors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"factor" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_add_ons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_seasons" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__services_v_version_seasons",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_headline" varchar,
  	"version_promise" varchar,
  	"version_summary" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_image_label" varchar,
  	"version_problem" varchar,
  	"version_method" varchar,
  	"version_safety" varchar,
  	"version_icon" "enum__services_v_version_icon",
  	"version_outcome_label" varchar,
  	"version_quote_mode" "enum__services_v_version_quote_mode" DEFAULT 'custom',
  	"version_parent_service_id" integer,
  	"version_dedicated_flow" "enum__services_v_version_dedicated_flow",
  	"version_requires_site_visit" boolean,
  	"version_quote_questions" jsonb DEFAULT '[]'::jsonb,
  	"version_from_price" numeric,
  	"version_booking_window_note" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_enabled" boolean DEFAULT true,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"solutions_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "service_categories_bundles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "service_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"headline" varchar,
  	"intro" varchar,
  	"hero_image_label" varchar,
  	"booking_note" varchar,
  	"icon" "enum_service_categories_icon",
  	"tone" "enum_service_categories_tone",
  	"menu_label" varchar,
  	"summary" varchar,
  	"outcome_label" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_service_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "service_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_service_categories_v_version_bundles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_headline" varchar,
  	"version_intro" varchar,
  	"version_hero_image_label" varchar,
  	"version_booking_note" varchar,
  	"version_icon" "enum__service_categories_v_version_icon",
  	"version_tone" "enum__service_categories_v_version_tone",
  	"version_menu_label" varchar,
  	"version_summary" varchar,
  	"version_outcome_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__service_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_service_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "pricing_rules_multipliers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"factor" numeric NOT NULL
  );
  
  CREATE TABLE "pricing_rules_add_ons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar DEFAULT 'yes' NOT NULL,
  	"price" numeric NOT NULL
  );
  
  CREATE TABLE "pricing_rules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"service_id" integer NOT NULL,
  	"unit" "enum_pricing_rules_unit" NOT NULL,
  	"quantity_question" varchar,
  	"base_fee" numeric DEFAULT 0 NOT NULL,
  	"unit_rate" numeric DEFAULT 0 NOT NULL,
  	"min_charge" numeric DEFAULT 0 NOT NULL,
  	"notes" varchar,
  	"needs_review" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "discounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_discounts_type" NOT NULL,
  	"min_services" numeric,
  	"frequency" "enum_discounts_frequency",
  	"percent" numeric NOT NULL,
  	"active" boolean DEFAULT true,
  	"needs_review" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"kind" "enum_plans_kind" NOT NULL,
  	"season" "enum_plans_season",
  	"tagline" varchar NOT NULL,
  	"price" numeric,
  	"price_unit" varchar,
  	"highlighted" boolean,
  	"needs_review" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plans_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "cities_neighborhoods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"blurb" varchar,
  	"image_label" varchar
  );
  
  CREATE TABLE "cities_local_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"source_name" varchar,
  	"source_url" varchar
  );
  
  CREATE TABLE "cities_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"intro" varchar,
  	"hero_image_label" varchar,
  	"why_choose_us" varchar,
  	"state" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "cities_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "cities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_cities_v_version_neighborhoods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"blurb" varchar,
  	"image_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v_version_local_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"source_name" varchar,
  	"source_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_intro" varchar,
  	"version_hero_image_label" varchar,
  	"version_why_choose_us" varchar,
  	"version_state" varchar,
  	"version_lat" numeric,
  	"version_lng" numeric,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_cities_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_cities_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"hero_image_label" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"category" "enum_posts_category",
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_image_label" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_category" "enum__posts_v_version_category",
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "solutions_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"problem" varchar,
  	"hero_image_id" integer,
  	"hero_image_label" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solutions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "_solutions_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_problem" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_image_label" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_solutions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category" NOT NULL,
  	"show_on_home" boolean,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"photo_id" integer,
  	"photo_label" varchar,
  	"source" "enum_testimonials_source" DEFAULT 'direct' NOT NULL,
  	"source_url" varchar,
  	"date" timestamp(3) with time zone,
  	"service_id" integer,
  	"city_id" integer,
  	"featured" boolean,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "google_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"review_id" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_photo_url" varchar,
  	"rating" numeric NOT NULL,
  	"text" varchar,
  	"review_url" varchar,
  	"published_at" timestamp(3) with time zone,
  	"fetched_at" timestamp(3) with time zone,
  	"hidden" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar NOT NULL,
  	"before_id" integer,
  	"after_id" integer,
  	"before_label" varchar,
  	"after_label" varchar,
  	"service_id" integer NOT NULL,
  	"category_id" integer,
  	"city_id" integer,
  	"featured" boolean,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"website" varchar,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"result" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"property_type" "enum_case_studies_property_type",
  	"challenge" varchar NOT NULL,
  	"solution" varchar NOT NULL,
  	"image_id" integer,
  	"image_label" varchar,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "team_members_specialities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"short_bio" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"photo_label" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"is_founder" boolean,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_members_v_version_specialities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_short_bio" varchar,
  	"version_bio" varchar,
  	"version_photo_id" integer,
  	"version_photo_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_is_founder" boolean,
  	"version_is_sample" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "job_openings_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "job_openings_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "job_openings_nice_to_have" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "job_openings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"location" varchar,
  	"pay_range" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"employment_type" "enum_job_openings_employment_type",
  	"active" boolean DEFAULT true,
  	"is_sample" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_job_openings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_job_openings_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_job_openings_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_job_openings_v_version_nice_to_have" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_job_openings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_location" varchar,
  	"version_pay_range" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_employment_type" "enum__job_openings_v_version_employment_type",
  	"version_active" boolean DEFAULT true,
  	"version_is_sample" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__job_openings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "leads_line_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer,
  	"service_name" varchar,
  	"answers" jsonb,
  	"price_low" numeric,
  	"price_high" numeric
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"address" varchar,
  	"postal_code" varchar,
  	"city_name" varchar,
  	"city_id" integer,
  	"property_type" "enum_leads_property_type",
  	"frequency" "enum_leads_frequency",
  	"total_low" numeric,
  	"total_high" numeric,
  	"preferred_dates" varchar,
  	"notes" varchar,
  	"details" jsonb,
  	"consent" boolean,
  	"consent_at" timestamp(3) with time zone,
  	"consent_text" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"referrer" varchar,
  	"landing_page" varchar,
  	"device" varchar,
  	"notification_status" "enum_leads_notification_status" DEFAULT 'pending',
  	"notification_log" jsonb,
  	"review_requested_at" timestamp(3) with time zone,
  	"type" "enum_leads_type" NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"out_of_area" boolean,
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"lead_files_id" integer
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"job_opening_id" integer,
  	"resume_id" integer,
  	"message" varchar,
  	"consent" boolean,
  	"status" "enum_applications_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_files" (
  	"id" serial PRIMARY KEY NOT NULL,
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
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"service_categories_id" integer,
  	"cities_id" integer,
  	"posts_id" integer,
  	"solutions_id" integer
  );
  
  CREATE TABLE "site_settings_demo" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_demo",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"tagline" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"address" varchar,
  	"hours" varchar,
  	"region" varchar,
  	"country" "enum_site_settings_country" DEFAULT 'US' NOT NULL,
  	"currency" "enum_site_settings_currency" DEFAULT 'USD' NOT NULL,
  	"locale" "enum_site_settings_locale" DEFAULT 'en-US' NOT NULL,
  	"founded_year" numeric,
  	"insurance_coverage" varchar,
  	"workers_comp_registration" varchar,
  	"response_time_promise" varchar,
  	"guarantee" varchar,
  	"stats_jobs_completed" numeric,
  	"stats_happy_clients" numeric,
  	"stats_rating" numeric,
  	"stats_review_count" numeric,
  	"google_place_id" varchar,
  	"google_review_url" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"social_linkedin" varchar,
  	"social_youtube" varchar,
  	"social_tiktok" varchar,
  	"social_nextdoor" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "seasonal_settings_announcements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"season" "enum_seasonal_settings_announcements_season" NOT NULL,
  	"message" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "seasonal_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seasons_spring_start_month" "enum_seasonal_settings_seasons_spring_start_month" NOT NULL,
  	"seasons_spring_start_day" numeric DEFAULT 1 NOT NULL,
  	"seasons_spring_end_month" "enum_seasonal_settings_seasons_spring_end_month" NOT NULL,
  	"seasons_spring_end_day" numeric NOT NULL,
  	"seasons_summer_start_month" "enum_seasonal_settings_seasons_summer_start_month" NOT NULL,
  	"seasons_summer_start_day" numeric DEFAULT 1 NOT NULL,
  	"seasons_summer_end_month" "enum_seasonal_settings_seasons_summer_end_month" NOT NULL,
  	"seasons_summer_end_day" numeric NOT NULL,
  	"seasons_fall_start_month" "enum_seasonal_settings_seasons_fall_start_month" NOT NULL,
  	"seasons_fall_start_day" numeric DEFAULT 1 NOT NULL,
  	"seasons_fall_end_month" "enum_seasonal_settings_seasons_fall_end_month" NOT NULL,
  	"seasons_fall_end_day" numeric NOT NULL,
  	"seasons_winter_start_month" "enum_seasonal_settings_seasons_winter_start_month" NOT NULL,
  	"seasons_winter_start_day" numeric DEFAULT 1 NOT NULL,
  	"seasons_winter_end_month" "enum_seasonal_settings_seasons_winter_end_month" NOT NULL,
  	"seasons_winter_end_day" numeric NOT NULL,
  	"seasons_holiday_start_month" "enum_seasonal_settings_seasons_holiday_start_month" NOT NULL,
  	"seasons_holiday_start_day" numeric DEFAULT 1 NOT NULL,
  	"seasons_holiday_end_month" "enum_seasonal_settings_seasons_holiday_end_month" NOT NULL,
  	"seasons_holiday_end_day" numeric NOT NULL,
  	"hero_override" "enum_seasonal_settings_hero_override" DEFAULT 'auto',
  	"snow_signup_deadline" timestamp(3) with time zone,
  	"routes_remaining" numeric,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_company_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_commercial_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_label" varchar NOT NULL,
  	"header_cta_href" varchar NOT NULL,
  	"featured_card_automatic" boolean DEFAULT true,
  	"featured_card_title" varchar,
  	"featured_card_text" varchar,
  	"featured_card_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_call_band_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blurb" varchar NOT NULL,
  	"services_per_category" numeric DEFAULT 5,
  	"call_band_heading" varchar NOT NULL,
  	"call_band_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_homepage_sections_section" NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "homepage_hero_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"season" "enum_homepage_hero_variants_season" NOT NULL,
  	"eyebrow" varchar,
  	"headline" varchar NOT NULL,
  	"subline" varchar NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"cta_href" varchar NOT NULL,
  	"image_label" varchar
  );
  
  CREATE TABLE "homepage_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"image_id" integer,
  	"image_label" varchar
  );
  
  CREATE TABLE "homepage_comparison_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar NOT NULL,
  	"us" varchar NOT NULL,
  	"independent" varchar NOT NULL,
  	"large" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"recurring_upsell" varchar,
  	"comparison_us_label" varchar NOT NULL,
  	"comparison_independent_label" varchar NOT NULL,
  	"comparison_large_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "feature_flags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city_service_pages" boolean,
  	"review_requests" boolean,
  	"cal_booking" boolean,
  	"cal_link" varchar,
  	"chat_widget" boolean,
  	"property_lookup" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pricing_settings_frequencies" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pricing_settings_frequencies",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pricing_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"range_low" numeric DEFAULT 0.9 NOT NULL,
  	"range_high" numeric DEFAULT 1.15 NOT NULL,
  	"tax_note" varchar NOT NULL,
  	"estimate_note" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pricing_rules_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "discounts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "plans_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "google_reviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gallery_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "client_logos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "job_openings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "applications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_included" ADD CONSTRAINT "services_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_card_bullets" ADD CONSTRAINT "services_card_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_price_factors" ADD CONSTRAINT "services_price_factors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_add_ons" ADD CONSTRAINT "services_add_ons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_seasons" ADD CONSTRAINT "services_seasons_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_parent_service_id_services_id_fk" FOREIGN KEY ("parent_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_benefits" ADD CONSTRAINT "_services_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_included" ADD CONSTRAINT "_services_v_version_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process" ADD CONSTRAINT "_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faqs" ADD CONSTRAINT "_services_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_card_bullets" ADD CONSTRAINT "_services_v_version_card_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_price_factors" ADD CONSTRAINT "_services_v_version_price_factors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_add_ons" ADD CONSTRAINT "_services_v_version_add_ons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_seasons" ADD CONSTRAINT "_services_v_version_seasons_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_parent_service_id_services_id_fk" FOREIGN KEY ("version_parent_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_category_id_service_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_categories_bundles" ADD CONSTRAINT "service_categories_bundles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_categories_rels" ADD CONSTRAINT "service_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_categories_rels" ADD CONSTRAINT "service_categories_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_categories_v_version_bundles" ADD CONSTRAINT "_service_categories_v_version_bundles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_categories_v" ADD CONSTRAINT "_service_categories_v_parent_id_service_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_categories_v" ADD CONSTRAINT "_service_categories_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_categories_v_rels" ADD CONSTRAINT "_service_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_service_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_categories_v_rels" ADD CONSTRAINT "_service_categories_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_rules_multipliers" ADD CONSTRAINT "pricing_rules_multipliers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_rules_add_ons" ADD CONSTRAINT "pricing_rules_add_ons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plans_features" ADD CONSTRAINT "plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans_rels" ADD CONSTRAINT "plans_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans_rels" ADD CONSTRAINT "plans_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_neighborhoods" ADD CONSTRAINT "cities_neighborhoods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_local_stats" ADD CONSTRAINT "cities_local_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_faqs" ADD CONSTRAINT "cities_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_texts" ADD CONSTRAINT "cities_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_rels" ADD CONSTRAINT "cities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_rels" ADD CONSTRAINT "cities_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_neighborhoods" ADD CONSTRAINT "_cities_v_version_neighborhoods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_local_stats" ADD CONSTRAINT "_cities_v_version_local_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_faqs" ADD CONSTRAINT "_cities_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v" ADD CONSTRAINT "_cities_v_parent_id_cities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cities_v" ADD CONSTRAINT "_cities_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cities_v_texts" ADD CONSTRAINT "_cities_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_rels" ADD CONSTRAINT "_cities_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_rels" ADD CONSTRAINT "_cities_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_team_members_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_faqs" ADD CONSTRAINT "solutions_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_faqs" ADD CONSTRAINT "_solutions_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_logos" ADD CONSTRAINT "client_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_results" ADD CONSTRAINT "case_studies_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_specialities" ADD CONSTRAINT "team_members_specialities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v_version_specialities" ADD CONSTRAINT "_team_members_v_version_specialities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_members_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_parent_id_team_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_members_v" ADD CONSTRAINT "_team_members_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_openings_responsibilities" ADD CONSTRAINT "job_openings_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_requirements" ADD CONSTRAINT "job_openings_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings_nice_to_have" ADD CONSTRAINT "job_openings_nice_to_have_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_responsibilities" ADD CONSTRAINT "_job_openings_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_requirements" ADD CONSTRAINT "_job_openings_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v_version_nice_to_have" ADD CONSTRAINT "_job_openings_v_version_nice_to_have_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_job_openings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_parent_id_job_openings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_openings_v" ADD CONSTRAINT "_job_openings_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_line_items" ADD CONSTRAINT "leads_line_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_line_items" ADD CONSTRAINT "leads_line_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_job_opening_id_job_openings_id_fk" FOREIGN KEY ("job_opening_id") REFERENCES "public"."job_openings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_lead_files_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."lead_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_service_categories_fk" FOREIGN KEY ("service_categories_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_demo" ADD CONSTRAINT "site_settings_demo_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seasonal_settings_announcements" ADD CONSTRAINT "seasonal_settings_announcements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seasonal_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_company_links" ADD CONSTRAINT "navigation_company_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_commercial_links" ADD CONSTRAINT "navigation_commercial_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_call_band_marquee" ADD CONSTRAINT "footer_call_band_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_sections" ADD CONSTRAINT "homepage_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_variants" ADD CONSTRAINT "homepage_hero_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_how_it_works" ADD CONSTRAINT "homepage_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_choose_us" ADD CONSTRAINT "homepage_why_choose_us_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_why_choose_us" ADD CONSTRAINT "homepage_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_comparison_rows" ADD CONSTRAINT "homepage_comparison_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_settings_frequencies" ADD CONSTRAINT "pricing_settings_frequencies_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pricing_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_included_order_idx" ON "services_included" USING btree ("_order");
  CREATE INDEX "services_included_parent_id_idx" ON "services_included" USING btree ("_parent_id");
  CREATE INDEX "services_process_order_idx" ON "services_process" USING btree ("_order");
  CREATE INDEX "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE INDEX "services_card_bullets_order_idx" ON "services_card_bullets" USING btree ("_order");
  CREATE INDEX "services_card_bullets_parent_id_idx" ON "services_card_bullets" USING btree ("_parent_id");
  CREATE INDEX "services_price_factors_order_idx" ON "services_price_factors" USING btree ("_order");
  CREATE INDEX "services_price_factors_parent_id_idx" ON "services_price_factors" USING btree ("_parent_id");
  CREATE INDEX "services_add_ons_order_idx" ON "services_add_ons" USING btree ("_order");
  CREATE INDEX "services_add_ons_parent_id_idx" ON "services_add_ons" USING btree ("_parent_id");
  CREATE INDEX "services_seasons_order_idx" ON "services_seasons" USING btree ("order");
  CREATE INDEX "services_seasons_parent_idx" ON "services_seasons" USING btree ("parent_id");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_parent_service_idx" ON "services" USING btree ("parent_service_id");
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_category_idx" ON "services" USING btree ("category_id");
  CREATE INDEX "services_enabled_idx" ON "services" USING btree ("enabled");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "services_rels_solutions_id_idx" ON "services_rels" USING btree ("solutions_id");
  CREATE INDEX "services_rels_posts_id_idx" ON "services_rels" USING btree ("posts_id");
  CREATE INDEX "_services_v_version_benefits_order_idx" ON "_services_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_services_v_version_benefits_parent_id_idx" ON "_services_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_included_order_idx" ON "_services_v_version_included" USING btree ("_order");
  CREATE INDEX "_services_v_version_included_parent_id_idx" ON "_services_v_version_included" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_process_order_idx" ON "_services_v_version_process" USING btree ("_order");
  CREATE INDEX "_services_v_version_process_parent_id_idx" ON "_services_v_version_process" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_faqs_order_idx" ON "_services_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_faqs_parent_id_idx" ON "_services_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_card_bullets_order_idx" ON "_services_v_version_card_bullets" USING btree ("_order");
  CREATE INDEX "_services_v_version_card_bullets_parent_id_idx" ON "_services_v_version_card_bullets" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_price_factors_order_idx" ON "_services_v_version_price_factors" USING btree ("_order");
  CREATE INDEX "_services_v_version_price_factors_parent_id_idx" ON "_services_v_version_price_factors" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_add_ons_order_idx" ON "_services_v_version_add_ons" USING btree ("_order");
  CREATE INDEX "_services_v_version_add_ons_parent_id_idx" ON "_services_v_version_add_ons" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_seasons_order_idx" ON "_services_v_version_seasons" USING btree ("order");
  CREATE INDEX "_services_v_version_seasons_parent_idx" ON "_services_v_version_seasons" USING btree ("parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_services_v_version_version_parent_service_idx" ON "_services_v" USING btree ("version_parent_service_id");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_category_idx" ON "_services_v" USING btree ("version_category_id");
  CREATE INDEX "_services_v_version_version_enabled_idx" ON "_services_v" USING btree ("version_enabled");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_rels_solutions_id_idx" ON "_services_v_rels" USING btree ("solutions_id");
  CREATE INDEX "_services_v_rels_posts_id_idx" ON "_services_v_rels" USING btree ("posts_id");
  CREATE INDEX "service_categories_bundles_order_idx" ON "service_categories_bundles" USING btree ("_order");
  CREATE INDEX "service_categories_bundles_parent_id_idx" ON "service_categories_bundles" USING btree ("_parent_id");
  CREATE INDEX "service_categories_meta_meta_image_idx" ON "service_categories" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "service_categories_slug_idx" ON "service_categories" USING btree ("slug");
  CREATE INDEX "service_categories_updated_at_idx" ON "service_categories" USING btree ("updated_at");
  CREATE INDEX "service_categories_created_at_idx" ON "service_categories" USING btree ("created_at");
  CREATE INDEX "service_categories__status_idx" ON "service_categories" USING btree ("_status");
  CREATE INDEX "service_categories_rels_order_idx" ON "service_categories_rels" USING btree ("order");
  CREATE INDEX "service_categories_rels_parent_idx" ON "service_categories_rels" USING btree ("parent_id");
  CREATE INDEX "service_categories_rels_path_idx" ON "service_categories_rels" USING btree ("path");
  CREATE INDEX "service_categories_rels_services_id_idx" ON "service_categories_rels" USING btree ("services_id");
  CREATE INDEX "_service_categories_v_version_bundles_order_idx" ON "_service_categories_v_version_bundles" USING btree ("_order");
  CREATE INDEX "_service_categories_v_version_bundles_parent_id_idx" ON "_service_categories_v_version_bundles" USING btree ("_parent_id");
  CREATE INDEX "_service_categories_v_parent_idx" ON "_service_categories_v" USING btree ("parent_id");
  CREATE INDEX "_service_categories_v_version_meta_version_meta_image_idx" ON "_service_categories_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_service_categories_v_version_version_slug_idx" ON "_service_categories_v" USING btree ("version_slug");
  CREATE INDEX "_service_categories_v_version_version_updated_at_idx" ON "_service_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_service_categories_v_version_version_created_at_idx" ON "_service_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_service_categories_v_version_version__status_idx" ON "_service_categories_v" USING btree ("version__status");
  CREATE INDEX "_service_categories_v_created_at_idx" ON "_service_categories_v" USING btree ("created_at");
  CREATE INDEX "_service_categories_v_updated_at_idx" ON "_service_categories_v" USING btree ("updated_at");
  CREATE INDEX "_service_categories_v_latest_idx" ON "_service_categories_v" USING btree ("latest");
  CREATE INDEX "_service_categories_v_rels_order_idx" ON "_service_categories_v_rels" USING btree ("order");
  CREATE INDEX "_service_categories_v_rels_parent_idx" ON "_service_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_service_categories_v_rels_path_idx" ON "_service_categories_v_rels" USING btree ("path");
  CREATE INDEX "_service_categories_v_rels_services_id_idx" ON "_service_categories_v_rels" USING btree ("services_id");
  CREATE INDEX "pricing_rules_multipliers_order_idx" ON "pricing_rules_multipliers" USING btree ("_order");
  CREATE INDEX "pricing_rules_multipliers_parent_id_idx" ON "pricing_rules_multipliers" USING btree ("_parent_id");
  CREATE INDEX "pricing_rules_add_ons_order_idx" ON "pricing_rules_add_ons" USING btree ("_order");
  CREATE INDEX "pricing_rules_add_ons_parent_id_idx" ON "pricing_rules_add_ons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pricing_rules_service_idx" ON "pricing_rules" USING btree ("service_id");
  CREATE INDEX "pricing_rules_needs_review_idx" ON "pricing_rules" USING btree ("needs_review");
  CREATE INDEX "pricing_rules_updated_at_idx" ON "pricing_rules" USING btree ("updated_at");
  CREATE INDEX "pricing_rules_created_at_idx" ON "pricing_rules" USING btree ("created_at");
  CREATE INDEX "discounts_needs_review_idx" ON "discounts" USING btree ("needs_review");
  CREATE INDEX "discounts_updated_at_idx" ON "discounts" USING btree ("updated_at");
  CREATE INDEX "discounts_created_at_idx" ON "discounts" USING btree ("created_at");
  CREATE INDEX "plans_features_order_idx" ON "plans_features" USING btree ("_order");
  CREATE INDEX "plans_features_parent_id_idx" ON "plans_features" USING btree ("_parent_id");
  CREATE INDEX "plans_needs_review_idx" ON "plans" USING btree ("needs_review");
  CREATE INDEX "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX "plans_created_at_idx" ON "plans" USING btree ("created_at");
  CREATE INDEX "plans_rels_order_idx" ON "plans_rels" USING btree ("order");
  CREATE INDEX "plans_rels_parent_idx" ON "plans_rels" USING btree ("parent_id");
  CREATE INDEX "plans_rels_path_idx" ON "plans_rels" USING btree ("path");
  CREATE INDEX "plans_rels_services_id_idx" ON "plans_rels" USING btree ("services_id");
  CREATE INDEX "cities_neighborhoods_order_idx" ON "cities_neighborhoods" USING btree ("_order");
  CREATE INDEX "cities_neighborhoods_parent_id_idx" ON "cities_neighborhoods" USING btree ("_parent_id");
  CREATE INDEX "cities_local_stats_order_idx" ON "cities_local_stats" USING btree ("_order");
  CREATE INDEX "cities_local_stats_parent_id_idx" ON "cities_local_stats" USING btree ("_parent_id");
  CREATE INDEX "cities_faqs_order_idx" ON "cities_faqs" USING btree ("_order");
  CREATE INDEX "cities_faqs_parent_id_idx" ON "cities_faqs" USING btree ("_parent_id");
  CREATE INDEX "cities_meta_meta_image_idx" ON "cities" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "cities__status_idx" ON "cities" USING btree ("_status");
  CREATE INDEX "cities_texts_order_parent" ON "cities_texts" USING btree ("order","parent_id");
  CREATE INDEX "cities_rels_order_idx" ON "cities_rels" USING btree ("order");
  CREATE INDEX "cities_rels_parent_idx" ON "cities_rels" USING btree ("parent_id");
  CREATE INDEX "cities_rels_path_idx" ON "cities_rels" USING btree ("path");
  CREATE INDEX "cities_rels_services_id_idx" ON "cities_rels" USING btree ("services_id");
  CREATE INDEX "_cities_v_version_neighborhoods_order_idx" ON "_cities_v_version_neighborhoods" USING btree ("_order");
  CREATE INDEX "_cities_v_version_neighborhoods_parent_id_idx" ON "_cities_v_version_neighborhoods" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_version_local_stats_order_idx" ON "_cities_v_version_local_stats" USING btree ("_order");
  CREATE INDEX "_cities_v_version_local_stats_parent_id_idx" ON "_cities_v_version_local_stats" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_version_faqs_order_idx" ON "_cities_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_cities_v_version_faqs_parent_id_idx" ON "_cities_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_parent_idx" ON "_cities_v" USING btree ("parent_id");
  CREATE INDEX "_cities_v_version_meta_version_meta_image_idx" ON "_cities_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_cities_v_version_version_slug_idx" ON "_cities_v" USING btree ("version_slug");
  CREATE INDEX "_cities_v_version_version_updated_at_idx" ON "_cities_v" USING btree ("version_updated_at");
  CREATE INDEX "_cities_v_version_version_created_at_idx" ON "_cities_v" USING btree ("version_created_at");
  CREATE INDEX "_cities_v_version_version__status_idx" ON "_cities_v" USING btree ("version__status");
  CREATE INDEX "_cities_v_created_at_idx" ON "_cities_v" USING btree ("created_at");
  CREATE INDEX "_cities_v_updated_at_idx" ON "_cities_v" USING btree ("updated_at");
  CREATE INDEX "_cities_v_latest_idx" ON "_cities_v" USING btree ("latest");
  CREATE INDEX "_cities_v_texts_order_parent" ON "_cities_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_cities_v_rels_order_idx" ON "_cities_v_rels" USING btree ("order");
  CREATE INDEX "_cities_v_rels_parent_idx" ON "_cities_v_rels" USING btree ("parent_id");
  CREATE INDEX "_cities_v_rels_path_idx" ON "_cities_v_rels" USING btree ("path");
  CREATE INDEX "_cities_v_rels_services_id_idx" ON "_cities_v_rels" USING btree ("services_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_services_id_idx" ON "posts_rels" USING btree ("services_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_services_id_idx" ON "_posts_v_rels" USING btree ("services_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "solutions_faqs_order_idx" ON "solutions_faqs" USING btree ("_order");
  CREATE INDEX "solutions_faqs_parent_id_idx" ON "solutions_faqs" USING btree ("_parent_id");
  CREATE INDEX "solutions_hero_image_idx" ON "solutions" USING btree ("hero_image_id");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_services_id_idx" ON "solutions_rels" USING btree ("services_id");
  CREATE INDEX "solutions_rels_solutions_id_idx" ON "solutions_rels" USING btree ("solutions_id");
  CREATE INDEX "_solutions_v_version_faqs_order_idx" ON "_solutions_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_faqs_parent_id_idx" ON "_solutions_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_hero_image_idx" ON "_solutions_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_solutions_v_version_meta_version_meta_image_idx" ON "_solutions_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v" USING btree ("version_slug");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "_solutions_v_rels_order_idx" ON "_solutions_v_rels" USING btree ("order");
  CREATE INDEX "_solutions_v_rels_parent_idx" ON "_solutions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_rels_path_idx" ON "_solutions_v_rels" USING btree ("path");
  CREATE INDEX "_solutions_v_rels_services_id_idx" ON "_solutions_v_rels" USING btree ("services_id");
  CREATE INDEX "_solutions_v_rels_solutions_id_idx" ON "_solutions_v_rels" USING btree ("solutions_id");
  CREATE UNIQUE INDEX "faqs_question_idx" ON "faqs" USING btree ("question");
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_rels_order_idx" ON "faqs_rels" USING btree ("order");
  CREATE INDEX "faqs_rels_parent_idx" ON "faqs_rels" USING btree ("parent_id");
  CREATE INDEX "faqs_rels_path_idx" ON "faqs_rels" USING btree ("path");
  CREATE INDEX "faqs_rels_services_id_idx" ON "faqs_rels" USING btree ("services_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_service_idx" ON "testimonials" USING btree ("service_id");
  CREATE INDEX "testimonials_city_idx" ON "testimonials" USING btree ("city_id");
  CREATE INDEX "testimonials_is_sample_idx" ON "testimonials" USING btree ("is_sample");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "google_reviews_review_id_idx" ON "google_reviews" USING btree ("review_id");
  CREATE INDEX "google_reviews_published_at_idx" ON "google_reviews" USING btree ("published_at");
  CREATE INDEX "google_reviews_updated_at_idx" ON "google_reviews" USING btree ("updated_at");
  CREATE INDEX "google_reviews_created_at_idx" ON "google_reviews" USING btree ("created_at");
  CREATE INDEX "gallery_items_before_idx" ON "gallery_items" USING btree ("before_id");
  CREATE INDEX "gallery_items_after_idx" ON "gallery_items" USING btree ("after_id");
  CREATE INDEX "gallery_items_service_idx" ON "gallery_items" USING btree ("service_id");
  CREATE INDEX "gallery_items_category_idx" ON "gallery_items" USING btree ("category_id");
  CREATE INDEX "gallery_items_city_idx" ON "gallery_items" USING btree ("city_id");
  CREATE INDEX "gallery_items_is_sample_idx" ON "gallery_items" USING btree ("is_sample");
  CREATE INDEX "gallery_items_updated_at_idx" ON "gallery_items" USING btree ("updated_at");
  CREATE INDEX "gallery_items_created_at_idx" ON "gallery_items" USING btree ("created_at");
  CREATE INDEX "client_logos_logo_idx" ON "client_logos" USING btree ("logo_id");
  CREATE INDEX "client_logos_is_sample_idx" ON "client_logos" USING btree ("is_sample");
  CREATE INDEX "client_logos_updated_at_idx" ON "client_logos" USING btree ("updated_at");
  CREATE INDEX "client_logos_created_at_idx" ON "client_logos" USING btree ("created_at");
  CREATE INDEX "case_studies_results_order_idx" ON "case_studies_results" USING btree ("_order");
  CREATE INDEX "case_studies_results_parent_id_idx" ON "case_studies_results" USING btree ("_parent_id");
  CREATE INDEX "case_studies_image_idx" ON "case_studies" USING btree ("image_id");
  CREATE INDEX "case_studies_is_sample_idx" ON "case_studies" USING btree ("is_sample");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_services_id_idx" ON "case_studies_rels" USING btree ("services_id");
  CREATE INDEX "team_members_specialities_order_idx" ON "team_members_specialities" USING btree ("_order");
  CREATE INDEX "team_members_specialities_parent_id_idx" ON "team_members_specialities" USING btree ("_parent_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_meta_meta_image_idx" ON "team_members" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");
  CREATE INDEX "team_members_is_sample_idx" ON "team_members" USING btree ("is_sample");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "team_members__status_idx" ON "team_members" USING btree ("_status");
  CREATE INDEX "_team_members_v_version_specialities_order_idx" ON "_team_members_v_version_specialities" USING btree ("_order");
  CREATE INDEX "_team_members_v_version_specialities_parent_id_idx" ON "_team_members_v_version_specialities" USING btree ("_parent_id");
  CREATE INDEX "_team_members_v_parent_idx" ON "_team_members_v" USING btree ("parent_id");
  CREATE INDEX "_team_members_v_version_version_photo_idx" ON "_team_members_v" USING btree ("version_photo_id");
  CREATE INDEX "_team_members_v_version_meta_version_meta_image_idx" ON "_team_members_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_team_members_v_version_version_slug_idx" ON "_team_members_v" USING btree ("version_slug");
  CREATE INDEX "_team_members_v_version_version_is_sample_idx" ON "_team_members_v" USING btree ("version_is_sample");
  CREATE INDEX "_team_members_v_version_version_updated_at_idx" ON "_team_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_members_v_version_version_created_at_idx" ON "_team_members_v" USING btree ("version_created_at");
  CREATE INDEX "_team_members_v_version_version__status_idx" ON "_team_members_v" USING btree ("version__status");
  CREATE INDEX "_team_members_v_created_at_idx" ON "_team_members_v" USING btree ("created_at");
  CREATE INDEX "_team_members_v_updated_at_idx" ON "_team_members_v" USING btree ("updated_at");
  CREATE INDEX "_team_members_v_latest_idx" ON "_team_members_v" USING btree ("latest");
  CREATE INDEX "job_openings_responsibilities_order_idx" ON "job_openings_responsibilities" USING btree ("_order");
  CREATE INDEX "job_openings_responsibilities_parent_id_idx" ON "job_openings_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "job_openings_requirements_order_idx" ON "job_openings_requirements" USING btree ("_order");
  CREATE INDEX "job_openings_requirements_parent_id_idx" ON "job_openings_requirements" USING btree ("_parent_id");
  CREATE INDEX "job_openings_nice_to_have_order_idx" ON "job_openings_nice_to_have" USING btree ("_order");
  CREATE INDEX "job_openings_nice_to_have_parent_id_idx" ON "job_openings_nice_to_have" USING btree ("_parent_id");
  CREATE INDEX "job_openings_meta_meta_image_idx" ON "job_openings" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");
  CREATE INDEX "job_openings_is_sample_idx" ON "job_openings" USING btree ("is_sample");
  CREATE INDEX "job_openings_updated_at_idx" ON "job_openings" USING btree ("updated_at");
  CREATE INDEX "job_openings_created_at_idx" ON "job_openings" USING btree ("created_at");
  CREATE INDEX "job_openings__status_idx" ON "job_openings" USING btree ("_status");
  CREATE INDEX "_job_openings_v_version_responsibilities_order_idx" ON "_job_openings_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_job_openings_v_version_responsibilities_parent_id_idx" ON "_job_openings_v_version_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "_job_openings_v_version_requirements_order_idx" ON "_job_openings_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_job_openings_v_version_requirements_parent_id_idx" ON "_job_openings_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_job_openings_v_version_nice_to_have_order_idx" ON "_job_openings_v_version_nice_to_have" USING btree ("_order");
  CREATE INDEX "_job_openings_v_version_nice_to_have_parent_id_idx" ON "_job_openings_v_version_nice_to_have" USING btree ("_parent_id");
  CREATE INDEX "_job_openings_v_parent_idx" ON "_job_openings_v" USING btree ("parent_id");
  CREATE INDEX "_job_openings_v_version_meta_version_meta_image_idx" ON "_job_openings_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_job_openings_v_version_version_slug_idx" ON "_job_openings_v" USING btree ("version_slug");
  CREATE INDEX "_job_openings_v_version_version_is_sample_idx" ON "_job_openings_v" USING btree ("version_is_sample");
  CREATE INDEX "_job_openings_v_version_version_updated_at_idx" ON "_job_openings_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_openings_v_version_version_created_at_idx" ON "_job_openings_v" USING btree ("version_created_at");
  CREATE INDEX "_job_openings_v_version_version__status_idx" ON "_job_openings_v" USING btree ("version__status");
  CREATE INDEX "_job_openings_v_created_at_idx" ON "_job_openings_v" USING btree ("created_at");
  CREATE INDEX "_job_openings_v_updated_at_idx" ON "_job_openings_v" USING btree ("updated_at");
  CREATE INDEX "_job_openings_v_latest_idx" ON "_job_openings_v" USING btree ("latest");
  CREATE INDEX "leads_line_items_order_idx" ON "leads_line_items" USING btree ("_order");
  CREATE INDEX "leads_line_items_parent_id_idx" ON "leads_line_items" USING btree ("_parent_id");
  CREATE INDEX "leads_line_items_service_idx" ON "leads_line_items" USING btree ("service_id");
  CREATE INDEX "leads_postal_code_idx" ON "leads" USING btree ("postal_code");
  CREATE INDEX "leads_city_idx" ON "leads" USING btree ("city_id");
  CREATE INDEX "leads_type_idx" ON "leads" USING btree ("type");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_out_of_area_idx" ON "leads" USING btree ("out_of_area");
  CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
  CREATE INDEX "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
  CREATE INDEX "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
  CREATE INDEX "leads_rels_services_id_idx" ON "leads_rels" USING btree ("services_id");
  CREATE INDEX "leads_rels_lead_files_id_idx" ON "leads_rels" USING btree ("lead_files_id");
  CREATE INDEX "applications_job_opening_idx" ON "applications" USING btree ("job_opening_id");
  CREATE INDEX "applications_resume_idx" ON "applications" USING btree ("resume_id");
  CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "lead_files_updated_at_idx" ON "lead_files" USING btree ("updated_at");
  CREATE INDEX "lead_files_created_at_idx" ON "lead_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_files_filename_idx" ON "lead_files" USING btree ("filename");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_services_id_idx" ON "redirects_rels" USING btree ("services_id");
  CREATE INDEX "redirects_rels_service_categories_id_idx" ON "redirects_rels" USING btree ("service_categories_id");
  CREATE INDEX "redirects_rels_cities_id_idx" ON "redirects_rels" USING btree ("cities_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_solutions_id_idx" ON "redirects_rels" USING btree ("solutions_id");
  CREATE INDEX "site_settings_demo_order_idx" ON "site_settings_demo" USING btree ("order");
  CREATE INDEX "site_settings_demo_parent_idx" ON "site_settings_demo" USING btree ("parent_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "seasonal_settings_announcements_order_idx" ON "seasonal_settings_announcements" USING btree ("_order");
  CREATE INDEX "seasonal_settings_announcements_parent_id_idx" ON "seasonal_settings_announcements" USING btree ("_parent_id");
  CREATE INDEX "navigation_company_links_order_idx" ON "navigation_company_links" USING btree ("_order");
  CREATE INDEX "navigation_company_links_parent_id_idx" ON "navigation_company_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_commercial_links_order_idx" ON "navigation_commercial_links" USING btree ("_order");
  CREATE INDEX "navigation_commercial_links_parent_id_idx" ON "navigation_commercial_links" USING btree ("_parent_id");
  CREATE INDEX "footer_call_band_marquee_order_idx" ON "footer_call_band_marquee" USING btree ("_order");
  CREATE INDEX "footer_call_band_marquee_parent_id_idx" ON "footer_call_band_marquee" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_sections_order_idx" ON "homepage_sections" USING btree ("_order");
  CREATE INDEX "homepage_sections_parent_id_idx" ON "homepage_sections" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_variants_order_idx" ON "homepage_hero_variants" USING btree ("_order");
  CREATE INDEX "homepage_hero_variants_parent_id_idx" ON "homepage_hero_variants" USING btree ("_parent_id");
  CREATE INDEX "homepage_how_it_works_order_idx" ON "homepage_how_it_works" USING btree ("_order");
  CREATE INDEX "homepage_how_it_works_parent_id_idx" ON "homepage_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_choose_us_order_idx" ON "homepage_why_choose_us" USING btree ("_order");
  CREATE INDEX "homepage_why_choose_us_parent_id_idx" ON "homepage_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_choose_us_image_idx" ON "homepage_why_choose_us" USING btree ("image_id");
  CREATE INDEX "homepage_comparison_rows_order_idx" ON "homepage_comparison_rows" USING btree ("_order");
  CREATE INDEX "homepage_comparison_rows_parent_id_idx" ON "homepage_comparison_rows" USING btree ("_parent_id");
  CREATE INDEX "pricing_settings_frequencies_order_idx" ON "pricing_settings_frequencies" USING btree ("order");
  CREATE INDEX "pricing_settings_frequencies_parent_idx" ON "pricing_settings_frequencies" USING btree ("parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_categories_fk" FOREIGN KEY ("service_categories_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_rules_fk" FOREIGN KEY ("pricing_rules_id") REFERENCES "public"."pricing_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_discounts_fk" FOREIGN KEY ("discounts_id") REFERENCES "public"."discounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_google_reviews_fk" FOREIGN KEY ("google_reviews_id") REFERENCES "public"."google_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_items_fk" FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_logos_fk" FOREIGN KEY ("client_logos_id") REFERENCES "public"."client_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_openings_fk" FOREIGN KEY ("job_openings_id") REFERENCES "public"."job_openings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_service_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("service_categories_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_rules_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_rules_id");
  CREATE INDEX "payload_locked_documents_rels_discounts_id_idx" ON "payload_locked_documents_rels" USING btree ("discounts_id");
  CREATE INDEX "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_google_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("google_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_items_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_items_id");
  CREATE INDEX "payload_locked_documents_rels_client_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("client_logos_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_job_openings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_openings_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_lead_files_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_files_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_card_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_price_factors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_add_ons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_seasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_included" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_card_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_price_factors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_add_ons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_seasons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_categories_bundles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_categories_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_categories_v_version_bundles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_service_categories_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_rules_multipliers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_rules_add_ons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_rules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "discounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_neighborhoods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_local_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v_version_neighborhoods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v_version_local_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cities_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "google_reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "client_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_specialities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v_version_specialities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_members_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings_responsibilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings_requirements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings_nice_to_have" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "job_openings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v_version_responsibilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v_version_requirements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v_version_nice_to_have" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_job_openings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_line_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_demo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seasonal_settings_announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seasonal_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_company_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_commercial_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_call_band_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_hero_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_how_it_works" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_why_choose_us" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_comparison_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "feature_flags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_settings_frequencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pricing_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_included" CASCADE;
  DROP TABLE "services_process" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services_card_bullets" CASCADE;
  DROP TABLE "services_price_factors" CASCADE;
  DROP TABLE "services_add_ons" CASCADE;
  DROP TABLE "services_seasons" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_version_benefits" CASCADE;
  DROP TABLE "_services_v_version_included" CASCADE;
  DROP TABLE "_services_v_version_process" CASCADE;
  DROP TABLE "_services_v_version_faqs" CASCADE;
  DROP TABLE "_services_v_version_card_bullets" CASCADE;
  DROP TABLE "_services_v_version_price_factors" CASCADE;
  DROP TABLE "_services_v_version_add_ons" CASCADE;
  DROP TABLE "_services_v_version_seasons" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "service_categories_bundles" CASCADE;
  DROP TABLE "service_categories" CASCADE;
  DROP TABLE "service_categories_rels" CASCADE;
  DROP TABLE "_service_categories_v_version_bundles" CASCADE;
  DROP TABLE "_service_categories_v" CASCADE;
  DROP TABLE "_service_categories_v_rels" CASCADE;
  DROP TABLE "pricing_rules_multipliers" CASCADE;
  DROP TABLE "pricing_rules_add_ons" CASCADE;
  DROP TABLE "pricing_rules" CASCADE;
  DROP TABLE "discounts" CASCADE;
  DROP TABLE "plans_features" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "plans_rels" CASCADE;
  DROP TABLE "cities_neighborhoods" CASCADE;
  DROP TABLE "cities_local_stats" CASCADE;
  DROP TABLE "cities_faqs" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "cities_texts" CASCADE;
  DROP TABLE "cities_rels" CASCADE;
  DROP TABLE "_cities_v_version_neighborhoods" CASCADE;
  DROP TABLE "_cities_v_version_local_stats" CASCADE;
  DROP TABLE "_cities_v_version_faqs" CASCADE;
  DROP TABLE "_cities_v" CASCADE;
  DROP TABLE "_cities_v_texts" CASCADE;
  DROP TABLE "_cities_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "solutions_faqs" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "_solutions_v_version_faqs" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "_solutions_v_rels" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "google_reviews" CASCADE;
  DROP TABLE "gallery_items" CASCADE;
  DROP TABLE "client_logos" CASCADE;
  DROP TABLE "case_studies_results" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "team_members_specialities" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "_team_members_v_version_specialities" CASCADE;
  DROP TABLE "_team_members_v" CASCADE;
  DROP TABLE "job_openings_responsibilities" CASCADE;
  DROP TABLE "job_openings_requirements" CASCADE;
  DROP TABLE "job_openings_nice_to_have" CASCADE;
  DROP TABLE "job_openings" CASCADE;
  DROP TABLE "_job_openings_v_version_responsibilities" CASCADE;
  DROP TABLE "_job_openings_v_version_requirements" CASCADE;
  DROP TABLE "_job_openings_v_version_nice_to_have" CASCADE;
  DROP TABLE "_job_openings_v" CASCADE;
  DROP TABLE "leads_line_items" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "leads_rels" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "lead_files" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "site_settings_demo" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "seasonal_settings_announcements" CASCADE;
  DROP TABLE "seasonal_settings" CASCADE;
  DROP TABLE "navigation_company_links" CASCADE;
  DROP TABLE "navigation_commercial_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_call_band_marquee" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "homepage_sections" CASCADE;
  DROP TABLE "homepage_hero_variants" CASCADE;
  DROP TABLE "homepage_how_it_works" CASCADE;
  DROP TABLE "homepage_why_choose_us" CASCADE;
  DROP TABLE "homepage_comparison_rows" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "feature_flags" CASCADE;
  DROP TABLE "pricing_settings_frequencies" CASCADE;
  DROP TABLE "pricing_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pricing_rules_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_discounts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_plans_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cities_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solutions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_google_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_gallery_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_client_logos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_job_openings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_service_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_pricing_rules_id_idx";
  DROP INDEX "payload_locked_documents_rels_discounts_id_idx";
  DROP INDEX "payload_locked_documents_rels_plans_id_idx";
  DROP INDEX "payload_locked_documents_rels_cities_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_solutions_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_google_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_gallery_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_client_logos_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_job_openings_id_idx";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pricing_rules_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "discounts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "plans_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solutions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "google_reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gallery_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "client_logos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "job_openings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_files_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  DROP TYPE "public"."enum_services_seasons";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_services_quote_mode";
  DROP TYPE "public"."enum_services_dedicated_flow";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_seasons";
  DROP TYPE "public"."enum__services_v_version_icon";
  DROP TYPE "public"."enum__services_v_version_quote_mode";
  DROP TYPE "public"."enum__services_v_version_dedicated_flow";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_service_categories_icon";
  DROP TYPE "public"."enum_service_categories_tone";
  DROP TYPE "public"."enum_service_categories_status";
  DROP TYPE "public"."enum__service_categories_v_version_icon";
  DROP TYPE "public"."enum__service_categories_v_version_tone";
  DROP TYPE "public"."enum__service_categories_v_version_status";
  DROP TYPE "public"."enum_pricing_rules_unit";
  DROP TYPE "public"."enum_discounts_type";
  DROP TYPE "public"."enum_discounts_frequency";
  DROP TYPE "public"."enum_plans_kind";
  DROP TYPE "public"."enum_plans_season";
  DROP TYPE "public"."enum_cities_status";
  DROP TYPE "public"."enum__cities_v_version_status";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_category";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_case_studies_property_type";
  DROP TYPE "public"."enum_team_members_status";
  DROP TYPE "public"."enum__team_members_v_version_status";
  DROP TYPE "public"."enum_job_openings_employment_type";
  DROP TYPE "public"."enum_job_openings_status";
  DROP TYPE "public"."enum__job_openings_v_version_employment_type";
  DROP TYPE "public"."enum__job_openings_v_version_status";
  DROP TYPE "public"."enum_leads_property_type";
  DROP TYPE "public"."enum_leads_frequency";
  DROP TYPE "public"."enum_leads_notification_status";
  DROP TYPE "public"."enum_leads_type";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_applications_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_site_settings_demo";
  DROP TYPE "public"."enum_site_settings_country";
  DROP TYPE "public"."enum_site_settings_currency";
  DROP TYPE "public"."enum_site_settings_locale";
  DROP TYPE "public"."enum_seasonal_settings_announcements_season";
  DROP TYPE "public"."enum_seasonal_settings_seasons_spring_start_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_spring_end_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_summer_start_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_summer_end_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_fall_start_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_fall_end_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_winter_start_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_winter_end_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_holiday_start_month";
  DROP TYPE "public"."enum_seasonal_settings_seasons_holiday_end_month";
  DROP TYPE "public"."enum_seasonal_settings_hero_override";
  DROP TYPE "public"."enum_homepage_sections_section";
  DROP TYPE "public"."enum_homepage_hero_variants_season";
  DROP TYPE "public"."enum_pricing_settings_frequencies";`)
}
