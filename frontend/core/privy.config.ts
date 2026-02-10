// Privy Configuration
// Get your Privy App ID from https://dashboard.privy.io/

export const PRIVY_CONFIG = {
  // Replace with your actual Privy App ID
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'YOUR_PRIVY_APP_ID',
  
  // Customize appearance
  appearance: {
    theme: 'dark' as const,
    accentColor: '#a3e635' as const, // Decensat color
    logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=decensat',
  },
  
  // Configure login methods (array of enabled methods)
  loginMethods: ['email', 'sms', 'wallet', 'google'] as const,

  // Embedded wallet configuration
  embeddedWallets: {
    createOnLogin: 'off' as const, // 'off' | 'users-without-wallets' | 'all-users'
  },
};
