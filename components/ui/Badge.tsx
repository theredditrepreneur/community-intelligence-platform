import type { ReactNode } from 'react';

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'orange' }) {
  return <span className={['badge', tone === 'orange' ? 'badge-orange' : 'badge-green'].join(' ')}>{children}</span>;
}
