import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function seedDemoUser() {
  try {
    // Check if demo user already exists
    let demoUser = await prisma.user.findUnique({
      where: { email: 'shradhesh@test.com' }
    });

    if (demoUser) {
      console.log('✅ Demo user already exists');
    } else {
      // Create demo user
      demoUser = await prisma.user.create({
        data: {
          email: 'shradhesh@test.com',
          emailVerified: true,
          phoneE164: '+1234567890',
          phoneVerified: true,
          whatsappVerified: true,
          businessName: 'Demo Company',
          authStage: 2, // Fully authenticated
          lastLogin: new Date(),
        }
      });
      console.log('✅ Demo user created successfully');
    }

    console.log('\n📋 Demo User Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID:              ${demoUser.id}`);
    console.log(`Email:           ${demoUser.email}`);
    console.log(`Business Name:   ${demoUser.businessName}`);
    console.log(`Phone:           ${demoUser.phoneE164}`);
    console.log(`Auth Stage:      ${demoUser.authStage}`);
    console.log(`Email Verified:  ${demoUser.emailVerified}`);
    console.log(`Phone Verified:  ${demoUser.phoneVerified}`);
    
    // Generate JWT token (matching the format used by authController)
    const secret = process.env.JWT_SECRET || 'Shradhesh71';
    const token = jwt.sign(
      { userId: demoUser.id, authStage: demoUser.authStage },
      secret,
      { expiresIn: '10d' }
    );

    console.log('\n🔑 JWT Token for Testing:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(token);
    
    console.log('\n📝 Usage Example:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('curl -X GET http://localhost:8000/api/auth/session \\');
    console.log(`  -H "Authorization: Bearer ${token}"`);
    
    console.log('\n✨ You can now use this token to test protected routes!\n');

  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoUser();
