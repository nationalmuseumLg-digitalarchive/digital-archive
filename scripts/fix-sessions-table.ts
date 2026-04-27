/**
 * fix-sessions-table.ts
 *
 * Fixes the users_sessions table schema mismatch between the legacy Payload
 * version (deployed on Vercel) and Payload v3.72.0 (deployed on Cloudflare).
 *
 * Run with:  npx tsx scripts/fix-sessions-table.ts
 */
import pg from 'pg'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('❌  DATABASE_URI not found in .env')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function main() {
  const client = await pool.connect()
  try {
    // ── 1. Show current schema so we can see what was wrong ─────────────────
    const { rows: cols } = await client.query<{ column_name: string; data_type: string }>(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users_sessions'
      ORDER BY ordinal_position
    `)

    if (cols.length === 0) {
      console.log('ℹ️   users_sessions does not exist yet — will create it.')
    } else {
      console.log('Current users_sessions columns:')
      cols.forEach(c => console.log(`  • ${c.column_name}  (${c.data_type})`))
    }

    // ── 2. Drop and recreate inside a transaction ────────────────────────────
    console.log('\nApplying fix inside a transaction…')
    await client.query('BEGIN')

    try {
      // Drop the old table (CASCADE removes any foreign-key dependents)
      await client.query('DROP TABLE IF EXISTS "users_sessions" CASCADE')

      // Recreate with the exact schema Payload v3.72.0 expects
      await client.query(`
        CREATE TABLE "users_sessions" (
          "_order"     integer                     NOT NULL,
          "_parent_id" integer                     NOT NULL,
          "id"         varchar          PRIMARY KEY NOT NULL,
          "created_at" timestamp(3) with time zone,
          "expires_at" timestamp(3) with time zone NOT NULL
        )
      `)

      // Foreign key back to users
      await client.query(`
        ALTER TABLE "users_sessions"
          ADD CONSTRAINT "users_sessions_parent_id_fk"
          FOREIGN KEY ("_parent_id")
          REFERENCES "public"."users"("id")
          ON DELETE cascade ON UPDATE no action
      `)

      // Indexes
      await client.query(
        `CREATE INDEX "users_sessions_order_idx"
         ON "users_sessions" USING btree ("_order")`
      )
      await client.query(
        `CREATE INDEX "users_sessions_parent_id_idx"
         ON "users_sessions" USING btree ("_parent_id")`
      )

      await client.query('COMMIT')
      console.log('✅  users_sessions recreated with correct schema.')
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('❌  Transaction rolled back:', err)
      throw err
    }

    // ── 3. Verify ────────────────────────────────────────────────────────────
    const { rows: verify } = await client.query<{ column_name: string; data_type: string }>(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users_sessions'
      ORDER BY ordinal_position
    `)
    console.log('\nNew users_sessions columns:')
    verify.forEach(c => console.log(`  • ${c.column_name}  (${c.data_type})`))
    console.log('\nDone. No redeploy needed — try logging in at /admin now.')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
