#!/usr/bin/env node

/**
 * Admin Seeding Script
 * Creates admin users from environment variables and predefined list
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://demo:1122334455@demo.hhebirj.mongodb.net/?retryWrites=true&w=majority&appName=demo')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  image: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'email'],
    default: 'credentials'
  },
  profile: Object,
  addresses: Array
}, {
  timestamps: true
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

const seedAdminUsers = async () => {
  try {
    await connectDB()

    console.log('🌱 Starting admin user seeding...')

    // Admin users to create
    const adminUsers = [
      {
        email: 'bhartistorytime@gmail.com',
        name: 'Main Admin',
        password: 'admin123456'
      },
      {
        email: 'admin1@tn.com',
        name: 'Admin 1',
        password: '12345678'
      },
      {
        email: 'admin2@tn.com',
        name: 'Admin 2',
        password: '12345678'
      },
      {
        email: 'admin3@tn.com',
        name: 'Admin 3',
        password: '12345678'
      },
      {
        email: 'admin4@tn.com',
        name: 'Admin 4',
        password: '12345678'
      },
      {
        email: 'admin5@tn.com',
        name: 'Admin 5',
        password: '12345678'
      }
    ]

    let createdCount = 0
    let existingCount = 0

    for (const adminData of adminUsers) {
      try {
        const existingUser = await User.findOne({ email: adminData.email })
        
        if (existingUser) {
          console.log(`⚠️  Admin user already exists: ${adminData.email}`)
          
          // Update existing user to ensure they have admin status
          if (!existingUser.isAdmin || !existingUser.emailVerified) {
            existingUser.isAdmin = true
            existingUser.emailVerified = true
            await existingUser.save()
            console.log(`🔄 Updated admin status for: ${adminData.email}`)
          }
          
          existingCount++
        } else {
          // Create new admin user
          const newAdmin = await User.create({
            email: adminData.email,
            name: adminData.name,
            password: adminData.password, // Will be hashed by pre-save hook
            isAdmin: true,
            emailVerified: true,
            provider: 'credentials'
          })
          
          console.log(`✅ Created admin user: ${adminData.email}`)
          createdCount++
        }
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Duplicate email detected: ${adminData.email}`)
          existingCount++
        } else {
          console.error(`❌ Error creating admin ${adminData.email}:`, error.message)
        }
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`✅ Created: ${createdCount} admin users`)
    console.log(`⚠️  Already existed: ${existingCount} admin users`)
    console.log(`📝 Total processed: ${adminUsers.length} admin users`)

    console.log('\n🔑 Admin Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: bhartistorytime@gmail.com')
    console.log('🔒 Password: admin123456')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email: admin1@tn.com (or admin2-5@tn.com)')
    console.log('🔒 Password: 12345678')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n🌐 Next Steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Go to: http://localhost:3000/auth/signin')
    console.log('3. Use any of the admin credentials above to sign in')
    console.log('4. Access admin panel at: http://localhost:3000/admin')

    console.log('\n🎉 Admin seeding completed successfully!')

  } catch (error) {
    console.error('❌ Admin seeding failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('📴 Disconnected from MongoDB')
  }
}

// Run the script
seedAdminUsers()
