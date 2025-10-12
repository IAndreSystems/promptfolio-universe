import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ProjectForm from '@/components/ProjectForm';
import { PortfolioProvider } from '@/contexts/PortfolioContext';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test' } },
        error: null,
      }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const mockOnSuccess = vi.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <PortfolioProvider>
      {component}
    </PortfolioProvider>
  );
};

describe('ProjectForm', () => {
  it('renders form', () => {
    const { container } = renderWithProvider(<ProjectForm onSuccess={mockOnSuccess} />);
    expect(container).toBeTruthy();
  });
});
