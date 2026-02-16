import { getPayload } from 'payload'
import config from '../src/payload.config'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function recoverOrphanedFiles() {
  const payload = await getPayload({ config })

  console.log('🔍 Finding orphaned media files...')

  // Get all ethnographic item image IDs and source block image IDs
  const ethnographicItems = await payload.find({
    collection: 'ethnographicItems',
    limit: 1000,
    pagination: false
  })

  const sourceBlocks = await payload.db.query({
    collection: 'alternative_pages_blocks_alternative_file',
    limit: 1000
  })

  const archivalBlocks = await payload.db.query({
    collection: 'alternative_pages_blocks_alternative_archival_file',
    limit: 1000
  })

  const referencedImageIds = new Set<number>()
  
  ethnographicItems.docs.forEach((item: any) => {
    if (item.image) referencedImageIds.add(typeof item.image === 'object' ? item.image.id : item.image)
  })

  sourceBlocks.forEach((block: any) => {
    if (block.image_id) referencedImageIds.add(block.image_id)
  })

  archivalBlocks.forEach((block: any) => {
    if (block.image_id) referencedImageIds.add(block.image_id)
    if (block.file_id) referencedImageIds.add(block.file_id)
  })

  console.log(`✅ Found ${referencedImageIds.size} referenced media files`)

  // Get all media files created before migration date
  const allMedia = await payload.find({
    collection: 'media',
    where: {
      createdAt: {
        less_than: '2026-01-25T00:00:00.000Z'
      }
    },
    limit: 5000,
    pagination: false
  })

  // Find orphaned files
  const orphanedFiles = allMedia.docs.filter((media: any) => !referencedImageIds.has(media.id))

  console.log(`🎯 Found ${orphanedFiles.length} orphaned files`)

  let recoveredCount = 0
  let skippedCount = 0

  for (const media of orphanedFiles) {
    try {
      // Extract object name from filename or alt text
      const objectName = media.alt || media.filename?.split('.')[0] || 'Unknown Object'
      
      // Parse filename to extract potential metadata
      const filenameParts = media.filename?.split('-') || []
      const accessionNumber = filenameParts.length > 1 ? filenameParts[filenameParts.length - 1]?.replace(/\.[^/.]+$/, '') : null

      // Check if this object already exists (by exact image match to prevent duplicates)
      const existing = await payload.find({
        collection: 'ethnographicItems',
        where: {
          image: {
            equals: media.id
          }
        },
        limit: 1
      })

      if (existing.docs.length > 0) {
        skippedCount++
        continue
      }

      // Create new ethnographic item record
      await payload.create({
        collection: 'ethnographicItems',
        data: {
          objectName: objectName,
          accessionNumber: accessionNumber,
          image: media.id,
          description: `Recovered from orphaned files on ${new Date().toISOString().split('T')[0]}`,
        }
      })

      recoveredCount++
      
      if (recoveredCount % 50 === 0) {
        console.log(`📦 Recovered ${recoveredCount} items...`)
      }

    } catch (error) {
      console.error(`❌ Error recovering file ${media.id}:`, error.message)
    }
  }

  console.log(`\n✅ Recovery complete!`)
  console.log(`   📦 Recovered: ${recoveredCount} items`)
  console.log(`   ⏭️  Skipped: ${skippedCount} items (already exist)`)
  console.log(`   📊 Total ethnographic items now: ${ethnographicItems.total + recoveredCount}`)

  process.exit(0)
}

recoverOrphanedFiles().catch((error) => {
  console.error('Recovery failed:', error)
  process.exit(1)
})
