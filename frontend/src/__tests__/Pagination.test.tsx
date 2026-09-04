/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Pagination from '../components/Pagination';

describe('Pagination Component', () => {
  afterEach(cleanup);

  it('renders the correct current page and total pages', () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={0} totalPages={3} setPage={mockSetPage} />);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('calls setPage when Next is clicked', () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={0} totalPages={3} setPage={mockSetPage} />);

    const nextBtn = screen.getByTestId('next-button');
    fireEvent.click(nextBtn);

    expect(mockSetPage).toHaveBeenCalledTimes(1);
  });

  it('disables the Next button on the final page', () => {
    const mockSetPage = vi.fn();
    render(<Pagination page={2} totalPages={3} setPage={mockSetPage} />);

    const nextBtn = screen.getByTestId('next-button');
    expect(nextBtn).toBeDisabled();
  });
});