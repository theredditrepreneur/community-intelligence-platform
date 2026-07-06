import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileAppBar, MobileBottomNav } from './MobileNavigation';

type AppShellProps = {
  children: ReactNode;
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover' | 'Admin';
  isAdmin?: boolean;
  user: {
    email?: string;
    name?: string;
  };
};

export function AppShell({ children, subscriptionLabel, isAdmin, user }: AppShellProps) {
  return (
    <div className="app-grid">
      <Sidebar subscriptionLabel={subscriptionLabel} isAdmin={isAdmin} user={user} />
      <MobileAppBar subscriptionLabel={subscriptionLabel} />
      <main className="main">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
