/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  it('calls onSearchChange each time the user types a letter', async () => {
    const user = userEvent.setup();
    const mockOnSearchChange = vi.fn();

    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByPlaceholderText('Search by Name, Category, or Location...');

    await user.type(input, 'Desk');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
  });
});