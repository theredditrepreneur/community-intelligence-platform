import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover';
  user: {
    email?: string;
    name?: string;
  };
};

export function AppShell({ children, subscriptionLabel, user }: AppShellProps) {
  return (
    <div className="app-grid">
      <Sidebar subscriptionLabel={subscriptionLabel} user={user} />
      <main className="main">{children}</main>
    </div>
  );
}
