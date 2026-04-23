import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
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
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_file" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"creation" varchar,
  	"accession" varchar,
  	"file_id" integer NOT NULL,
  	"authors" varchar,
  	"keyword" varchar,
  	"condition" varchar,
  	"location" varchar,
  	"rights" varchar,
  	"identifiers" varchar,
  	"provenance" varchar,
  	"slug" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alternative_pages_blocks_alternative_file" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"object_name" varchar,
  	"local_name" varchar,
  	"accession" varchar,
  	"accession_number" varchar,
  	"image_id" integer,
  	"location" varchar,
  	"aquisition" varchar,
  	"production" varchar,
  	"height" varchar,
  	"width" varchar,
  	"breadth" varchar,
  	"length" varchar,
  	"weight" varchar,
  	"circumference" varchar,
  	"description" varchar,
  	"provenance" varchar,
  	"entry" varchar,
  	"staff" varchar,
  	"file_id" integer,
  	"period" varchar,
  	"photographer" varchar,
  	"keyword" varchar,
  	"identifiers" varchar,
  	"slug" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "alternative_pages_blocks_alternative_archival_file" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"naha" varchar,
  	"author" varchar,
  	"object_type" varchar,
  	"ethnicity_group" varchar,
  	"image_id" integer,
  	"artist" varchar,
  	"geographic_origin" varchar,
  	"provenance" varchar,
  	"entry" varchar,
  	"staff" varchar,
  	"file_id" integer,
  	"identifiers" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "alternative_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alternative_pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ethnographic_items_id" integer
  );
  
  CREATE TABLE "ethnographic_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"object_name" varchar NOT NULL,
  	"local_name" varchar,
  	"accession" varchar,
  	"accession_number" varchar,
  	"image_id" integer,
  	"location" varchar,
  	"aquisition" varchar,
  	"production" varchar,
  	"height" varchar,
  	"width" varchar,
  	"breadth" varchar,
  	"length" varchar,
  	"weight" varchar,
  	"circumference" varchar,
  	"description" varchar,
  	"provenance" varchar,
  	"ethnicity" varchar,
  	"geographic_origin" varchar,
  	"identifiers" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"file_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "manuscripts_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "manuscripts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "intelligence_reports_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "intelligence_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ethnography_and_archaeology_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "ethnography_and_archaeology" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "government_reports_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "government_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alternative_heritages_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "alternative_heritages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alternative_archival_heritages_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "alternative_archival_heritages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"alternative_pages_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"alternative_pages_id" integer,
  	"ethnographic_items_id" integer,
  	"maps_id" integer,
  	"manuscripts_id" integer,
  	"intelligence_reports_id" integer,
  	"ethnography_and_archaeology_id" integer,
  	"government_reports_id" integer,
  	"alternative_heritages_id" integer,
  	"alternative_archival_heritages_id" integer,
  	"photos_id" integer,
  	"search_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"copyright_notice" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file" ADD CONSTRAINT "pages_blocks_file_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_file" ADD CONSTRAINT "pages_blocks_file_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_file" ADD CONSTRAINT "pages_blocks_file_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_file_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_file_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_file_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alternative_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_archival_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_archival_file_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_archival_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_archival_file_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "alternative_pages_blocks_alternative_archival_file" ADD CONSTRAINT "alternative_pages_blocks_alternative_archival_file_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alternative_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alternative_pages_rels" ADD CONSTRAINT "alternative_pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."alternative_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alternative_pages_rels" ADD CONSTRAINT "alternative_pages_rels_ethnographic_items_fk" FOREIGN KEY ("ethnographic_items_id") REFERENCES "public"."ethnographic_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ethnographic_items" ADD CONSTRAINT "ethnographic_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maps" ADD CONSTRAINT "maps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maps" ADD CONSTRAINT "maps_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "manuscripts_nav" ADD CONSTRAINT "manuscripts_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."manuscripts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "intelligence_reports_nav" ADD CONSTRAINT "intelligence_reports_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."intelligence_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ethnography_and_archaeology_nav" ADD CONSTRAINT "ethnography_and_archaeology_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ethnography_and_archaeology"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "government_reports_nav" ADD CONSTRAINT "government_reports_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."government_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alternative_heritages_nav" ADD CONSTRAINT "alternative_heritages_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alternative_heritages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alternative_archival_heritages_nav" ADD CONSTRAINT "alternative_archival_heritages_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alternative_archival_heritages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photos" ADD CONSTRAINT "photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_alternative_pages_fk" FOREIGN KEY ("alternative_pages_id") REFERENCES "public"."alternative_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alternative_pages_fk" FOREIGN KEY ("alternative_pages_id") REFERENCES "public"."alternative_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ethnographic_items_fk" FOREIGN KEY ("ethnographic_items_id") REFERENCES "public"."ethnographic_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maps_fk" FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_manuscripts_fk" FOREIGN KEY ("manuscripts_id") REFERENCES "public"."manuscripts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_intelligence_reports_fk" FOREIGN KEY ("intelligence_reports_id") REFERENCES "public"."intelligence_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ethnography_and_archaeology_fk" FOREIGN KEY ("ethnography_and_archaeology_id") REFERENCES "public"."ethnography_and_archaeology"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_government_reports_fk" FOREIGN KEY ("government_reports_id") REFERENCES "public"."government_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alternative_heritages_fk" FOREIGN KEY ("alternative_heritages_id") REFERENCES "public"."alternative_heritages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alternative_archival_herita_fk" FOREIGN KEY ("alternative_archival_heritages_id") REFERENCES "public"."alternative_archival_heritages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav" ADD CONSTRAINT "header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_nav" ADD CONSTRAINT "footer_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_alt_idx" ON "media" USING btree ("alt");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "pages_blocks_file_order_idx" ON "pages_blocks_file" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_parent_id_idx" ON "pages_blocks_file" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_path_idx" ON "pages_blocks_file" USING btree ("_path");
  CREATE INDEX "pages_blocks_file_image_idx" ON "pages_blocks_file" USING btree ("image_id");
  CREATE INDEX "pages_blocks_file_file_idx" ON "pages_blocks_file" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_blocks_file_identifiers_idx" ON "pages_blocks_file" USING btree ("identifiers");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "alternative_pages_blocks_alternative_file_order_idx" ON "alternative_pages_blocks_alternative_file" USING btree ("_order");
  CREATE INDEX "alternative_pages_blocks_alternative_file_parent_id_idx" ON "alternative_pages_blocks_alternative_file" USING btree ("_parent_id");
  CREATE INDEX "alternative_pages_blocks_alternative_file_path_idx" ON "alternative_pages_blocks_alternative_file" USING btree ("_path");
  CREATE INDEX "alternative_pages_blocks_alternative_file_image_idx" ON "alternative_pages_blocks_alternative_file" USING btree ("image_id");
  CREATE INDEX "alternative_pages_blocks_alternative_file_file_idx" ON "alternative_pages_blocks_alternative_file" USING btree ("file_id");
  CREATE INDEX "alternative_pages_blocks_alternative_archival_file_order_idx" ON "alternative_pages_blocks_alternative_archival_file" USING btree ("_order");
  CREATE INDEX "alternative_pages_blocks_alternative_archival_file_parent_id_idx" ON "alternative_pages_blocks_alternative_archival_file" USING btree ("_parent_id");
  CREATE INDEX "alternative_pages_blocks_alternative_archival_file_path_idx" ON "alternative_pages_blocks_alternative_archival_file" USING btree ("_path");
  CREATE INDEX "alternative_pages_blocks_alternative_archival_file_image_idx" ON "alternative_pages_blocks_alternative_archival_file" USING btree ("image_id");
  CREATE INDEX "alternative_pages_blocks_alternative_archival_file_file_idx" ON "alternative_pages_blocks_alternative_archival_file" USING btree ("file_id");
  CREATE INDEX "alternative_pages_slug_idx" ON "alternative_pages" USING btree ("slug");
  CREATE INDEX "alternative_pages_updated_at_idx" ON "alternative_pages" USING btree ("updated_at");
  CREATE INDEX "alternative_pages_created_at_idx" ON "alternative_pages" USING btree ("created_at");
  CREATE INDEX "alternative_pages_rels_order_idx" ON "alternative_pages_rels" USING btree ("order");
  CREATE INDEX "alternative_pages_rels_parent_idx" ON "alternative_pages_rels" USING btree ("parent_id");
  CREATE INDEX "alternative_pages_rels_path_idx" ON "alternative_pages_rels" USING btree ("path");
  CREATE INDEX "alternative_pages_rels_ethnographic_items_id_idx" ON "alternative_pages_rels" USING btree ("ethnographic_items_id");
  CREATE INDEX "ethnographic_items_object_name_idx" ON "ethnographic_items" USING btree ("object_name");
  CREATE INDEX "ethnographic_items_accession_number_idx" ON "ethnographic_items" USING btree ("accession_number");
  CREATE INDEX "ethnographic_items_image_idx" ON "ethnographic_items" USING btree ("image_id");
  CREATE INDEX "ethnographic_items_geographic_origin_idx" ON "ethnographic_items" USING btree ("geographic_origin");
  CREATE INDEX "ethnographic_items_updated_at_idx" ON "ethnographic_items" USING btree ("updated_at");
  CREATE INDEX "maps_image_idx" ON "maps" USING btree ("image_id");
  CREATE INDEX "maps_file_idx" ON "maps" USING btree ("file_id");
  CREATE INDEX "maps_updated_at_idx" ON "maps" USING btree ("updated_at");
  CREATE INDEX "maps_created_at_idx" ON "maps" USING btree ("created_at");
  CREATE INDEX "manuscripts_nav_order_idx" ON "manuscripts_nav" USING btree ("_order");
  CREATE INDEX "manuscripts_nav_parent_id_idx" ON "manuscripts_nav" USING btree ("_parent_id");
  CREATE INDEX "manuscripts_updated_at_idx" ON "manuscripts" USING btree ("updated_at");
  CREATE INDEX "manuscripts_created_at_idx" ON "manuscripts" USING btree ("created_at");
  CREATE INDEX "intelligence_reports_nav_order_idx" ON "intelligence_reports_nav" USING btree ("_order");
  CREATE INDEX "intelligence_reports_nav_parent_id_idx" ON "intelligence_reports_nav" USING btree ("_parent_id");
  CREATE INDEX "intelligence_reports_updated_at_idx" ON "intelligence_reports" USING btree ("updated_at");
  CREATE INDEX "intelligence_reports_created_at_idx" ON "intelligence_reports" USING btree ("created_at");
  CREATE INDEX "ethnography_and_archaeology_nav_order_idx" ON "ethnography_and_archaeology_nav" USING btree ("_order");
  CREATE INDEX "ethnography_and_archaeology_nav_parent_id_idx" ON "ethnography_and_archaeology_nav" USING btree ("_parent_id");
  CREATE INDEX "ethnography_and_archaeology_updated_at_idx" ON "ethnography_and_archaeology" USING btree ("updated_at");
  CREATE INDEX "ethnography_and_archaeology_created_at_idx" ON "ethnography_and_archaeology" USING btree ("created_at");
  CREATE INDEX "government_reports_nav_order_idx" ON "government_reports_nav" USING btree ("_order");
  CREATE INDEX "government_reports_nav_parent_id_idx" ON "government_reports_nav" USING btree ("_parent_id");
  CREATE INDEX "government_reports_updated_at_idx" ON "government_reports" USING btree ("updated_at");
  CREATE INDEX "government_reports_created_at_idx" ON "government_reports" USING btree ("created_at");
  CREATE INDEX "alternative_heritages_nav_order_idx" ON "alternative_heritages_nav" USING btree ("_order");
  CREATE INDEX "alternative_heritages_nav_parent_id_idx" ON "alternative_heritages_nav" USING btree ("_parent_id");
  CREATE INDEX "alternative_heritages_updated_at_idx" ON "alternative_heritages" USING btree ("updated_at");
  CREATE INDEX "alternative_heritages_created_at_idx" ON "alternative_heritages" USING btree ("created_at");
  CREATE INDEX "alternative_archival_heritages_nav_order_idx" ON "alternative_archival_heritages_nav" USING btree ("_order");
  CREATE INDEX "alternative_archival_heritages_nav_parent_id_idx" ON "alternative_archival_heritages_nav" USING btree ("_parent_id");
  CREATE INDEX "alternative_archival_heritages_updated_at_idx" ON "alternative_archival_heritages" USING btree ("updated_at");
  CREATE INDEX "alternative_archival_heritages_created_at_idx" ON "alternative_archival_heritages" USING btree ("created_at");
  CREATE INDEX "photos_image_idx" ON "photos" USING btree ("image_id");
  CREATE INDEX "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
  CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_alternative_pages_id_idx" ON "search_rels" USING btree ("alternative_pages_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_alternative_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("alternative_pages_id");
  CREATE INDEX "payload_locked_documents_rels_ethnographic_items_id_idx" ON "payload_locked_documents_rels" USING btree ("ethnographic_items_id");
  CREATE INDEX "payload_locked_documents_rels_maps_id_idx" ON "payload_locked_documents_rels" USING btree ("maps_id");
  CREATE INDEX "payload_locked_documents_rels_manuscripts_id_idx" ON "payload_locked_documents_rels" USING btree ("manuscripts_id");
  CREATE INDEX "payload_locked_documents_rels_intelligence_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("intelligence_reports_id");
  CREATE INDEX "payload_locked_documents_rels_ethnography_and_archaeolog_idx" ON "payload_locked_documents_rels" USING btree ("ethnography_and_archaeology_id");
  CREATE INDEX "payload_locked_documents_rels_government_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("government_reports_id");
  CREATE INDEX "payload_locked_documents_rels_alternative_heritages_id_idx" ON "payload_locked_documents_rels" USING btree ("alternative_heritages_id");
  CREATE INDEX "payload_locked_documents_rels_alternative_archival_herit_idx" ON "payload_locked_documents_rels" USING btree ("alternative_archival_heritages_id");
  CREATE INDEX "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_order_idx" ON "header_nav" USING btree ("_order");
  CREATE INDEX "header_nav_parent_id_idx" ON "header_nav" USING btree ("_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "footer_nav_order_idx" ON "footer_nav" USING btree ("_order");
  CREATE INDEX "footer_nav_parent_id_idx" ON "footer_nav" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_file" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "alternative_pages_blocks_alternative_file" CASCADE;
  DROP TABLE "alternative_pages_blocks_alternative_archival_file" CASCADE;
  DROP TABLE "alternative_pages" CASCADE;
  DROP TABLE "alternative_pages_rels" CASCADE;
  DROP TABLE "ethnographic_items" CASCADE;
  DROP TABLE "maps" CASCADE;
  DROP TABLE "manuscripts_nav" CASCADE;
  DROP TABLE "manuscripts" CASCADE;
  DROP TABLE "intelligence_reports_nav" CASCADE;
  DROP TABLE "intelligence_reports" CASCADE;
  DROP TABLE "ethnography_and_archaeology_nav" CASCADE;
  DROP TABLE "ethnography_and_archaeology" CASCADE;
  DROP TABLE "government_reports_nav" CASCADE;
  DROP TABLE "government_reports" CASCADE;
  DROP TABLE "alternative_heritages_nav" CASCADE;
  DROP TABLE "alternative_heritages" CASCADE;
  DROP TABLE "alternative_archival_heritages_nav" CASCADE;
  DROP TABLE "alternative_archival_heritages" CASCADE;
  DROP TABLE "photos" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_nav" CASCADE;
  DROP TABLE "footer" CASCADE;`)
}
