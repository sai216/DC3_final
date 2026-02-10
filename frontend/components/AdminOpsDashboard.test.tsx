
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminOpsDashboard from './AdminOpsDashboard';
import { AuthStage, UserProfile } from '../types';

const mockAdmin: UserProfile = {
  userId: 'admin-id',
  email: 'ops@decensat.io',
  businessDomain: 'decensat.io',
  srt: 999,
  nodes: 10,
  tier: 'VENTURE',
  // Fix: AuthStage.Active does not exist in root types.ts. Using valid AuthStage.ProjectEngaged stage.
  authStage: AuthStage.ProjectEngaged,
  roles: ['admin', 'ops'],
  authTimestamp: Date.now(),
  authProvider: 'privy'
};

describe('AdminOpsDashboard Component', () => {
  const mockExit = vi.fn();

  it('renders Dashboard Overview by default', () => {
    render(<AdminOpsDashboard user={mockAdmin} onExit={mockExit} />);
    expect(screen.getByText('Active_Builds')).toBeDefined();
  });

  it('switches to Approvals Gate and selects an email', async () => {
    render(<AdminOpsDashboard user={mockAdmin} onExit={mockExit} />);
    const gateBtn = screen.getByText('Gate');
    fireEvent.click(gateBtn);

    expect(screen.getByText('Communication Gate')).toBeDefined();
    
    // Select first pending email
    const pendingSignals = screen.getAllByText('pending_review');
    fireEvent.click(pendingSignals[0].closest('button')!);

    expect(screen.getByText('Signal_Preview: AUDIT_INITIATED')).toBeDefined();
  });

  it('enters editing mode in the approval gate', async () => {
    render(<AdminOpsDashboard user={mockAdmin} onExit={mockExit} />);
    fireEvent.click(screen.getByText('Gate'));
    
    // Wait for and click email
    const pendingSignals = screen.getAllByText('pending_review');
    fireEvent.click(pendingSignals[0].closest('button')!);

    const editBtn = screen.getByText('Edit Signal');
    fireEvent.click(editBtn);

    expect(screen.getByText('Principal_Editor_Mode')).toBeDefined();
    expect(screen.getByLabelText('SUBJECT_HEADER')).toBeDefined();
  });

  it('switches to Lifecycle view and triggers status picker', () => {
    render(<AdminOpsDashboard user={mockAdmin} onExit={mockExit} />);
    fireEvent.click(screen.getByText('Lifecycle'));
    
    expect(screen.getByText('Lifecycle Registry')).toBeDefined();
    
    const editStatusBtns = screen.getAllByTitle('Manually Update Status');
    fireEvent.click(editStatusBtns[0]);
    
    expect(screen.getByText('Migrate_Phase')).toBeDefined();
    expect(screen.getByText('assessment complete')).toBeDefined();
  });
});
