import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Expanding the search plugin from 2 to 10 collections makes the `doc`
// polymorphic relationship point at 10 collections. Payload's Postgres adapter
// stores that in `search_rels` with one FK column per related collection. The
// original migration only added the scalar search fields, not these relationship
// columns, so any query/sync touching a new collection failed with
// "column search__rels.<x>_id does not exist". This adds the 8 missing columns,
// their FKs (ON DELETE CASCADE, matching pages_id/alternative_pages_id), and
// their indexes. Idempotent so it is safe to re-run.
const RELATIONS: { col: string; table: string }[] = [
  { col: 'ethnographic_items_id', table: 'ethnographic_items' },
  { col: 'maps_id', table: 'maps' },
  { col: 'manuscripts_id', table: 'manuscripts' },
  { col: 'intelligence_reports_id', table: 'intelligence_reports' },
  { col: 'government_reports_id', table: 'government_reports' },
  { col: 'photos_id', table: 'photos' },
  { col: 'alternative_heritages_id', table: 'alternative_heritages' },
  { col: 'alternative_archival_heritages_id', table: 'alternative_archival_heritages' },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Denormalised thumbnail URL on the search index (see searchOverrides.fields).
  await db.execute(sql.raw(`ALTER TABLE "search" ADD COLUMN IF NOT EXISTS "image_url" varchar;`))

  for (const { col, table } of RELATIONS) {
    const fk = `search_rels_${table}_fk`
    const idx = `search_rels_${col}_idx`
    await db.execute(sql.raw(`
      ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "${col}" integer;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${fk}') THEN
          ALTER TABLE "search_rels" ADD CONSTRAINT "${fk}"
            FOREIGN KEY ("${col}") REFERENCES "public"."${table}"("id") ON DELETE CASCADE;
        END IF;
      END $$;
      CREATE INDEX IF NOT EXISTS "${idx}" ON "search_rels" ("${col}");
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TABLE "search" DROP COLUMN IF EXISTS "image_url";`))

  for (const { col, table } of RELATIONS) {
    const fk = `search_rels_${table}_fk`
    const idx = `search_rels_${col}_idx`
    await db.execute(sql.raw(`
      DROP INDEX IF EXISTS "${idx}";
      ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "${fk}";
      ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "${col}";
    `))
  }
}
