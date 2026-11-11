import { render, screen, fireEvent } from '@testing-library/react';
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
});
