
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserConsole from './UserConsole';
import { AuthStage, UserProfile } from '../types';

const mockUser: UserProfile = {
  userId: 'test-user-id',
  email: 'architect@decensat.io',
  businessDomain: 'decensat.io',
  srt: 950,
  nodes: 5,
  tier: 'ELITE',
  // Fix: AuthStage.Active does not exist in root types.ts. Using valid AuthStage.ProjectEngaged stage.
  authStage: AuthStage.ProjectEngaged,
  roles: ['user', 'admin'],
  authTimestamp: Date.now(),
  authProvider: 'privy'
};

describe('UserConsole Component', () => {
  const mockClose = vi.fn();
  const mockLogout = vi.fn();
  const mockUpdate = vi.fn();

  it('renders Overview tab by default', () => {
    render(<UserConsole user={mockUser} onClose={mockClose} onLogout={mockLogout} />);
    expect(screen.getByText('Active Collateral')).toBeDefined();
    expect(screen.getByText('$85,000.00')).toBeDefined();
  });

  it('honors initialTab prop for deep linking', () => {
    render(<UserConsole user={mockUser} onClose={mockClose} onLogout={mockLogout} initialTab="settings" />);
    expect(screen.getByText('Identity Node Registry')).toBeDefined();
    expect(screen.getByText('Security_Handshake')).toBeDefined();
  });

  it('switches tabs on click', () => {
    render(<UserConsole user={mockUser} onClose={mockClose} onLogout={mockLogout} />);
    const auditTabButton = screen.getAllByText('Audit Log')[0]; // Mobile vs Desktop buttons
    fireEvent.click(auditTabButton);
    expect(screen.getByText('SOC-2 Audit Trail')).toBeDefined();
  });

  it('calls onLogout when disconnect button is clicked', () => {
    render(<UserConsole user={mockUser} onClose={mockClose} onLogout={mockLogout} />);
    const logoutBtn = screen.getByText('Disconnect Node');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<UserConsole user={mockUser} onClose={mockClose} onLogout={mockLogout} />);
    const closeBtn = screen.getByRole('button', { name: /X/i });
    fireEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});
