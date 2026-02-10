import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ShieldAlert, Check, Calendar, Clock, ArrowRight, ShieldCheck, 
  Loader2, Video, AlertCircle, RefreshCw, Lock, Terminal, Activity, 
  Sparkles, Coins, Landmark, Globe, Database, Bot, Wallet, CreditCard, 
  Smartphone as ApplePayIcon, Zap, Fingerprint, Package, Link as LinkIcon,
  ChevronRight, ArrowUpRight, Shield, Key, ExternalLink, Smartphone, UserCheck,
  CreditCard as CardIcon, Apple as AppleIcon, Upload,
  Phone, Mail, Chrome
} from 'lucide-react';
import { normalizePhone, isValidE164 } from '../core/validation';
import { usePrivy } from '@privy-io/react-auth';

/**
 * STRIPE_API_DEVELOPER_IMPLEMENTATION_NOTE:
 * The 'INSTITUTIONAL CARD' and 'MOBILE WALLETS' tabs are wired to support 
 * Stripe Elements (v4.5). To finalize, developers should:
 * 1. Generate a PaymentIntent on the backend.
 * 2. Pass the clientSecret to the handleExecuteCheckout logic below.
 * 3. Use confirmPayment() from @stripe/react-stripe-js.
 */

type BookingStep = 'confirmation' | 'email_auth' | 'manifest_composition' | 'auth_identity' | 'google_meet' | 'phone_ident' | 'otp_verify' | 'checkout' | 'scheduling' | 'success';

interface ServiceBookingModalProps {
  item: { id: string, name: string, title?: string, price?: number, isByo?: boolean };
  onClose: () => void;
  initialStep?: BookingStep;
}

const STRIPE_FEE_MULTIPLIER = 1.03333; // 3.333% Institutional Surcharge

const WALLET_PROVIDERS = [
  { id: 'phantom', name: 'Phantom', icon: '👻', color: 'text-purple-400' },
  { id: 'coinbase', name: 'Coinbase', icon: '🔵', color: 'text-blue-500' },
  { id: 'metamask', name: 'MetaMask', icon: '🦊', color: 'text-orange-500' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', color: 'text-indigo-400' },
  { id: 'trust', name: 'Trust', icon: '🛡️', color: 'text-blue-400' },
  { id: 'uniswap', name: 'Uniswap', icon: '🦄', color: 'text-pink-500' }
];

const UCP_RAILS = [
  { 
    id: 'privy', 
    label: 'USDC DeFi Mesh', 
    sub: 'Full DeFi Handshake', 
    icon: Fingerprint, 
    color: 'text-decensat',
    protocol: 'PRIVY_STABLE_SYNC_V1.4',
    fee: '0%',
  },
  { 
    id: 'mobile', 
    label: 'Mobile Wallets', 
    sub: 'Apple Pay & Google Pay', 
    icon: ApplePayIcon, 
    color: 'text-blue-400',
    protocol: 'STRIPE_EXPRESS_RAIL',
    fee: '3.333%'
  },
  { 
    id: 'card', 
    label: 'Institutional Card', 
    sub: 'Stripe Settlement API', 
    icon: CreditCard, 
    color: 'text-slate-400',
    protocol: 'STRIPE_LEGACY_RAIL',
    fee: '3.333%'
  }
];

const ReownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22.9515 0.584343L23.1643 0.79155C23.1764 0.803387 23.1873 0.81643 23.1969 0.830607C23.2065 0.844783 23.2146 0.859813 23.2211 0.875618C23.2276 0.891424 23.2323 0.907694 23.2351 0.924296C23.2378 0.940899 23.2386 0.957707 23.2373 0.974465V0.974465C23.2361 1.01188 23.2435 1.04897 23.259 1.0829C23.2745 1.11684 23.2976 1.14674 23.3267 1.17036L30.9388 7.37567C31.2721 7.64741 31.464 8.04653 31.464 8.4673C31.464 8.88806 31.2721 9.28718 30.9388 9.55892L23.3267 15.7642C23.2976 15.7879 23.2745 15.8178 23.259 15.8517C23.2435 15.8856 23.2361 15.9227 23.2373 15.9601V15.9601C23.2386 15.9769 23.2378 15.9937 23.2351 16.0103C23.2323 16.0269 23.2276 16.0432 23.2211 16.059C23.2146 16.0748 23.2065 16.0898 23.1969 16.104C23.1873 16.1182 23.1764 16.1312 23.1643 16.143L22.9515 16.3503C22.6582 16.6358 22.259 16.7938 21.8441 16.7885C21.4293 16.7831 21.0336 16.6149 20.7461 16.3218L16.2941 11.7854C16.2152 11.7049 16.107 11.6596 15.9939 11.6596C15.8808 11.6596 15.7725 11.7049 15.6937 11.7854L11.2417 16.3218C10.9542 16.6149 10.5585 16.7831 10.1436 16.7885C9.72877 16.7938 9.32958 16.6358 9.03624 16.3503L8.82343 16.143C8.81134 16.1312 8.80037 16.1182 8.79079 16.104C8.78121 16.0898 8.7732 16.0748 8.76675 16.059C8.7603 16.0432 8.75554 16.0269 8.75259 16.0103C8.74965 15.9937 8.74857 15.9769 8.74939 15.9601V15.9601C8.7506 15.9227 8.74317 15.8856 8.72772 15.8517C8.71228 15.8178 8.68918 15.7879 8.66012 15.7642L1.04799 9.55892C0.714732 9.28718 0.522858 8.88806 0.522858 8.4673C0.522858 8.04653 0.714732 7.64741 1.04799 7.37567L8.66012 1.17036C8.68918 1.14674 8.71228 1.11684 8.72772 1.0829C8.74317 1.04897 8.7506 1.01188 8.74939 0.974465V0.974465C8.74857 0.957707 8.74965 0.940899 8.75259 0.924296C8.75554 0.907694 8.7603 0.891424 8.76675 0.875618C8.7732 0.859813 8.78121 0.844783 8.79079 0.830607C8.80037 0.81643 8.81134 0.803387 8.82343 0.79155L9.03624 0.584343C9.32958 0.298818 9.72877 0.140815 10.1436 0.146143C10.5585 0.15147 10.9542 0.319717 11.2417 0.612847L15.6937 5.14922C15.7725 5.22971 15.8808 5.27503 15.9939 5.27503C16.107 5.27503 16.2152 5.22971 16.2941 5.14922L20.7461 0.612847C21.0336 0.319717 21.4293 0.15147 21.8441 0.146143C22.259 0.140815 22.6582 0.298818 22.9515 0.584343Z" />
  </svg>
);

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ onClose }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>('confirmation');
  const [walletAddress, setWalletAddress] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'sms' | 'google' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [handshakeConfirmed, setHandshakeConfirmed] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedUcpRail, setSelectedUcpRail] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
  const [manifestData, setManifestData] = useState({
    loomUrl: '',
    docsUrl: '',
    uploadedFiles: [] as File[]
  });
  const [authIdentityData, setAuthIdentityData] = useState({
    linkedinUrl: '',
    businessEmail: '',
    whatsappNumber: ''
  });
  
  // Placeholder return for simplified component
  return null;
};

export default ServiceBookingModal;
