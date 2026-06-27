import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover';
};

export function AppShell({ children, subscriptionLabel }: AppShellProps) {
  return (
    <div className="app-grid">
      <Sidebar subscriptionLabel={subscriptionLabel} />
      <main className="main">{children}</main>
    </div>
  );
}
