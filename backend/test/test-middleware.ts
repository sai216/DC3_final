import dotenv from 'dotenv';
dotenv.config();

console.log("Testing authentication middleware import...\n");
console.log("Environment variables:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ SET" : "✗ NOT SET");
console.log("PRIVY_APP_ID:", process.env.PRIVY_APP_ID ? "✓ SET" : "✗ NOT SET");
console.log("PRIVY_APP_SECRET:", process.env.PRIVY_APP_SECRET ? "✓ SET" : "✗ NOT SET");

async function testImport() {
  try {
    console.log("\nImporting authMiddleware...");
    const authModule = await import('../middleware/authMiddleware.js');
    console.log("✓ authMiddleware imported successfully");
    console.log("authenticateToken function:", typeof authModule.authenticateToken);
  } catch (error: any) {
    console.log("✗ Failed to import authMiddleware");
    console.log("Error:", error.message);
    console.log("Stack:", error.stack);
  }
}

testImport();
