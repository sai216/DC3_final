import { PrivyClient } from '@privy-io/node';

// Initialize Privy client
const privyAppId = process.env.PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

if (!privyAppId || !privyAppSecret) {
  throw new Error('PRIVY_APP_ID and PRIVY_APP_SECRET must be set in environment variables');
}

export const privyClient = new PrivyClient({
  appId: privyAppId,
  appSecret: privyAppSecret,
});

export const privyService = {
  /**
   * Verify Privy access token
   * @param accessToken - The Privy access token to verify
   * @returns The verified claims from the token
   */
  async verifyToken(accessToken: string) {
    try {
      const verifiedClaims = await privyClient.utils().auth().verifyAccessToken(accessToken);
      return verifiedClaims;
    } catch (error) {
      console.error('Privy token verification error:', error);
      throw new Error('Invalid or expired token');
    }
  },

  /**
   * Get user by DID
   * @param userId - The Privy user ID (DID)
   * @returns User information from Privy
   */
  async getUserByDid(userId: string) {
    try {
      const user = await privyClient.users()._get(userId);
      return user;
    } catch (error) {
      console.error('Error fetching Privy user:', error);
      throw new Error('Failed to fetch user from Privy');
    }
  },

  /**
   * Get user by wallet address
   * @param walletAddress - The wallet address
   * @returns User information from Privy
   */
  async getUserByWalletAddress(walletAddress: string) {
    try {
      const user = await privyClient.users().getByWalletAddress({
        address: walletAddress,
      });
      return user;
    } catch (error) {
      console.error('Error fetching Privy user by wallet:', error);
      throw new Error('Failed to fetch user by wallet address');
    }
  },

  /**
   * Get user by email
   * @param email - The email address
   * @returns User information from Privy
   */
  async getUserByEmail(email: string) {
    try {
      const user = await privyClient.users().getByEmailAddress({
        address: email,
      });
      return user;
    } catch (error) {
      console.error('Error fetching Privy user by email:', error);
      return null; // Return null if user not found
    }
  },
};