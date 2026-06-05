import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_alternative_pages_section" AS ENUM('alternative_heritages_objects', 'alternative_heritage_archival');
  ALTER TABLE "alternative_pages" ADD COLUMN "section" "enum_alternative_pages_section" DEFAULT 'alternative_heritages_objects';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "alternative_pages" DROP COLUMN IF EXISTS "section";
  DROP TYPE IF EXISTS "public"."enum_alternative_pages_section";`)
}
