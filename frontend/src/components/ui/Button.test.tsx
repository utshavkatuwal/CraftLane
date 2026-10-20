// Craftlane — Button tests
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children and calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-busy and disables when loading', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('renders leading and trailing icons', () => {
    render(
      <Button
        leadingIcon={<span aria-label="leading" />}
        trailingIcon={<span aria-label="trailing" />}
      >
        With icons
      </Button>
    );
    expect(screen.getByLabelText('leading')).toBeInTheDocument();
    expect(screen.getByLabelText('trailing')).toBeInTheDocument();
  });
});
