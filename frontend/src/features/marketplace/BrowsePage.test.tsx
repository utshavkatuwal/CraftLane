// Craftlane — Browse page tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { BrowsePage } from '@/features/marketplace/BrowsePage';

vi.mock('@/features/marketplace/marketplace.service', () => ({
  fetchProjects: vi.fn(),
}));

import { fetchProjects } from '@/features/marketplace/marketplace.service';
const mockedFetchProjects = fetchProjects as ReturnType<typeof vi.fn>;

describe('BrowsePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders an honest empty state when no projects exist', async () => {
    mockedFetchProjects.mockResolvedValue({
      projects: [],
      pagination: { page: 1, page_size: 20, total: 0, total_pages: 0 },
    });
    render(<BrowsePage />);
    await waitFor(() => {
      expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    });
    // No project cards rendered
    expect(screen.queryByRole('link', { name: /project/i })).not.toBeInTheDocument();
  });

  it('shows error state when backend is unreachable', async () => {
    mockedFetchProjects.mockRejectedValue(new Error('Failed to fetch'));
    render(<BrowsePage />);
    await waitFor(() => {
      expect(screen.getByText(/unable to load projects/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders project cards when projects exist', async () => {
    mockedFetchProjects.mockResolvedValue({
      projects: [
        {
          id: 'p1',
          title: 'Website design',
          description: 'A landing page for a small business.',
          status: 'published',
          project_type: 'fixed_price',
          budget_min: 1000,
          currency: 'USD',
          deadline: '2026-11-01',
          skills: ['Design', 'Figma'],
          client_id: 'c1',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
      ],
      pagination: { page: 1, page_size: 20, total: 1, total_pages: 1 },
    });
    render(<BrowsePage />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /website design/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/\$1,000.00/)).toBeInTheDocument();
  });

  it('does not fabricate projects when no backend data is available', async () => {
    mockedFetchProjects.mockRejectedValue(new Error('Network error'));
    render(<BrowsePage />);
    await waitFor(() => {
      expect(screen.getByText(/unable to load projects/i)).toBeInTheDocument();
    });
    const body = document.body.textContent || '';
    expect(body).not.toMatch(/\$\d+/);
  });
});
