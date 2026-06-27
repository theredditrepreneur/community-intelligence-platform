import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
