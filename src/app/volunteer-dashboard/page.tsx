'use client';

import RoleGuard from '@/components/RoleGuard';
import VolunteerDashboard from '@/components/VolunteerDashboard';

export default function VolunteerDashboardPage() {
  return (
    <RoleGuard allowedRole="volunteer">
      {(profile, handleLogout) => <VolunteerDashboard key={profile.id} profile={profile} onLogout={handleLogout} />}
    </RoleGuard>
  );
}
