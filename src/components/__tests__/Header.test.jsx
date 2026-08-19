import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  const defaultProps = {
    viewMode: 'preview',
    setViewMode: vi.fn(),
    onOpenExport: vi.fn(),
    onReset: vi.fn(),
    onQuickQR: vi.fn(),
    onPublish: vi.fn(),
    profile: { name: 'Test User' },
    isUnlocked: true,
    onRequestUnlock: vi.fn(),
  };

  it('renders header logo title correctly', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('QR Linktree')).toBeInTheDocument();
  });

  it('triggers view mode changes when tabs are clicked', () => {
    const setViewMode = vi.fn();
    render(<Header {...defaultProps} setViewMode={setViewMode} />);

    const editorTab = screen.getByText(/studio editor/i);
    fireEvent.click(editorTab);
    expect(setViewMode).toHaveBeenCalledWith('editor');
  });
});
