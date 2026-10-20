import { fireEvent, render, screen } from '@/test/test-utils';
import { Header } from './Header';

describe('Header mobile navigation', () => {
  it('opens from the menu button and closes from the backdrop', () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss navigation menu' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
