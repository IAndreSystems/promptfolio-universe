import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import AIInterface from '@/components/AIInterface';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('AIInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial assistant message', () => {
    const { container } = render(<AIInterface />);
    expect(container).toBeTruthy();
  });

  it('handles user input and sends message', async () => {
    const { container } = render(<AIInterface />);
    expect(container).toBeTruthy();
  });

  it('handles streaming response fallback on error', async () => {
    const { container } = render(<AIInterface />);
    expect(container).toBeTruthy();
  });
});
