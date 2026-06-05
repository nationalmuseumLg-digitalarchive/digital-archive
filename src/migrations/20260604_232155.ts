import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "type" varchar;
    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "excerpt" varchar;
    ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "collection_route" varchar;
    -- Only "type" is filtered with equality; index it. "excerpt"/"title" are
    -- searched with ILIKE '%term%', which a btree index cannot serve, so no
    -- index there. Drop one if a previous dev push created it.
    CREATE INDEX IF NOT EXISTS "search_type_idx" ON "search" ("type");
    DROP INDEX IF EXISTS "search_excerpt_idx";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "search_type_idx";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "type";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "excerpt";
    ALTER TABLE "search" DROP COLUMN IF EXISTS "collection_route";
  `)
}
