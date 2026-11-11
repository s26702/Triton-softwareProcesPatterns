import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerDashboard from '@/components/VolunteerDashboard';

describe('Volunteer dashboard', () => {
  it('uses the authenticated profile and registers a shift only after acknowledgement', () => {
    render(<VolunteerDashboard profile={{id:'v1',email:'volunteer@example.org',role:'volunteer'}} onLogout={vi.fn()} />);
    expect(screen.getByText(/Signed in as volunteer@example.org/)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button',{name:'View shifts'})[0]);
    expect(screen.getByRole('button',{name:'Fully booked'})).toBeDisabled();
    fireEvent.click(screen.getAllByRole('button',{name:'Choose shift'})[0]);
    expect(screen.getByRole('button',{name:'Confirm registration'})).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button',{name:'Confirm registration'}));
    expect(screen.getByRole('status')).toHaveTextContent('Registration confirmed');
    fireEvent.click(screen.getByRole('button',{name:'Find events'}));
    fireEvent.click(screen.getAllByRole('button',{name:'View shifts'})[0]);
    expect(screen.getByRole('button',{name:'Registered'})).toBeDisabled();
  });
  it.each([
    { date: '2026-11-11T12:00:00', label: 'November 2026', today: 11, days: 30, offset: 6 },
    { date: '2028-02-15T12:00:00', label: 'February 2028', today: 15, days: 29, offset: 1 },
  ])('shows $label with the correct weekday alignment and today highlighted', ({date, label, today, days, offset}) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(date));
    try {
      render(<VolunteerDashboard profile={{id:'v1',email:'volunteer@example.org',role:'volunteer'}} onLogout={vi.fn()} />);
      const calendar = screen.getByRole('region', {name: `${label} shift calendar`});
      expect(within(calendar).getByText(label)).toBeInTheDocument();
      const currentDay = within(calendar).getByLabelText(`${today} ${label}, today`);
      expect(currentDay).toHaveAttribute('aria-current', 'date');
      expect(currentDay).toHaveClass('bg-[#FF0000]/10');
      expect(within(calendar).getByLabelText(`${days} ${label}`)).toBeInTheDocument();
      expect(within(calendar).queryByLabelText(`${days + 1} ${label}`)).not.toBeInTheDocument();
      const firstDay = within(calendar).getByLabelText(`1 ${label}`);
      expect(Array.from(firstDay.parentElement!.children).indexOf(firstDay)).toBe(7 + offset);
      expect(within(calendar).queryByText('Your calendar')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

});
