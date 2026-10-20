// Craftlane — Routing tests
import { describe, it, expect } from 'vitest';
import { routes } from '@/app/router';

describe('Routing', () => {
  it('defines explicit routes including not-found', () => {
    const paths = routes.map((r) => r.path ?? '');
    expect(paths).toContain('/');
    expect(paths).toContain('/sign-up');
    expect(paths).toContain('/sign-in');
    expect(paths).toContain('/work');
    expect(paths).toContain('/work/:projectId');
    expect(paths).toContain('/freelancers/:id');
    expect(paths).toContain('/dashboard/client');
    expect(paths).toContain('/dashboard/freelancer');
    expect(paths).toContain('*');
  });

  it('orders routes from most specific to least specific, with not-found last', () => {
    const paths = routes.map((r) => r.path);
    expect(paths[paths.length - 1]).toBe('*');
    expect(paths[0]).toBe('/');
  });

  it('all route paths are strings and non-empty', () => {
    for (const route of routes) {
      expect(typeof route.path).toBe('string');
      expect((route.path ?? '').length).toBeGreaterThan(0);
    }
  });
});
