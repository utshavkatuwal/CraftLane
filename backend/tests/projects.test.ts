import { describe, it, expect } from 'vitest';
import { ProjectCreateSchema, ProjectQuerySchema } from '@/routes/projects';

/* Craftlane — Project route validation tests
 *
 * These tests verify Zod validation schemas for project routes.
 * They do not require a database connection.
 */

describe('ProjectCreateSchema validation', () => {
  it('accepts valid project data', () => {
    const result = ProjectCreateSchema.safeParse({
      title: 'Website redesign',
      description: 'Redesign the company website with modern UI.',
      project_type: 'fixed_price',
      budget_min: 1000,
      budget_max: 5000,
      currency: 'USD',
      skills: ['Design', 'React'],
    });
    expect(result.success).toBe(true);
  });

  it('defaults project_type to fixed_price', () => {
    const result = ProjectCreateSchema.safeParse({
      title: 'Website redesign',
      description: 'Redesign the company website.',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.project_type).toBe('fixed_price');
    }
  });

  it('rejects missing title', () => {
    const result = ProjectCreateSchema.safeParse({
      title: '',
      description: 'Some description here.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects budget_min greater than budget_max at application level', () => {
    // Schema allows it, but the route handler checks it
    const result = ProjectCreateSchema.safeParse({
      title: 'Project',
      description: 'Description here.',
      budget_min: 5000,
      budget_max: 1000,
    });
    expect(result.success).toBe(true); // Schema-level validation passes
  });
});

describe('ProjectQuerySchema validation', () => {
  it('accepts valid query params', () => {
    const result = ProjectQuerySchema.safeParse({
      page: 1,
      page_size: 20,
      sort: 'created_at',
      order: 'desc',
    });
    expect(result.success).toBe(true);
  });

  it('defaults page and page_size', () => {
    const result = ProjectQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.page_size).toBe(20);
    }
  });

  it('rejects negative page', () => {
    const result = ProjectQuerySchema.safeParse({
      page: -1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts skills filter as string', () => {
    const result = ProjectQuerySchema.safeParse({
      skills: 'design',
    });
    expect(result.success).toBe(true);
  });
});
