// Craftlane — FormField tests
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';

describe('FormField', () => {
  it('renders label, input, and associates them', () => {
    render(
      <FormField id="email" label="Email address" required>
        <Input id="email" type="email" />
      </FormField>
    );
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeRequired();
  });

  it('renders error text in a role=alert region and marks input invalid', () => {
    render(
      <FormField id="email" label="Email address" error="Invalid email.">
        <Input id="email" type="email" />
      </FormField>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid email.');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text when no error', () => {
    render(
      <FormField id="email" label="Email address" helper="We won't share it.">
        <Input id="email" type="email" />
      </FormField>
    );
    expect(screen.getByText(/we won't share it/i)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
