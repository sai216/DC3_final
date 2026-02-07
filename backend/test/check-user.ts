import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const userId = '52fcc8ee-9c00-43e9-aff3-125ed28b2d6f';
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (user) {
    console.log('✓ User found:', JSON.stringify(user, null, 2));
  } else {
    console.log('✗ User NOT found with ID:', userId);
    
    // Check all users
    const allUsers = await prisma.user.findMany();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    if (allUsers.length > 0) {
      console.log('\nFirst user in database:');
      console.log(JSON.stringify(allUsers[0], null, 2));
    }
  }
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
