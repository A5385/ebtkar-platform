import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Page', () => {
    it('renders the dashboard page', () => {
        render(<Page />);

        expect(screen.getByRole('heading', { name: /welcome @org\/admin/i })).toBeTruthy();
    });
});
