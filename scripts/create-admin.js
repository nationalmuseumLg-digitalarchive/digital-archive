// scripts/create-admin.js
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const run = async () => {
  const payload = await getPayload({ config })
  
  const email = 'joseph.com'
  const password = '000000'
  
  console.log(`Checking if user ${email} exists...`)
  
  // Check if user already exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email
      }
    }
  })
  
  // Delete existing user if found
  if (existingUsers.docs.length > 0) {
    console.log('User exists, deleting...')
    await payload.delete({
      collection: 'users',
      id: existingUsers.docs[0].id
    })
    console.log('Existing user deleted')
  }
  
  console.log(`Creating admin user: ${email}`)
  
  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password
    }
  })

  console.log('✅ Admin user created successfully!')
  console.log(`   Email: ${user.email}`)
  console.log(`   ID: ${user.id}`)
  console.log(`   Password: ${password}`)
  console.log('\nYou can now log in at /admin')
  process.exit(0)
}

run().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})