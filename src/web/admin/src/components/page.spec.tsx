import { render, screen } from '@testing-library/react';
import HomePage from './Home';

describe('Page', () => {
    it('renders the dashboard page', () => {
        render(<HomePage />);

        expect(screen.getByRole('heading', { name: /welcome @org\/admin/i })).toBeTruthy();
    });
});
