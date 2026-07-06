'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/config/navigation';
import { platform } from '@/lib/config/platform';

const primaryNavigation = navigation.filter((item) =>
  ['dashboard', 'analyse', 'discover', 'action-centre', 'alerts'].includes(item.id)
);

type MobileNavigationProps = {
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover' | 'Admin';
};

export function MobileAppBar({ subscriptionLabel }: MobileNavigationProps) {
  return (
    <header className="mobile-app-bar">
      <Link href="/app/dashboard" className="mobile-brand" aria-label="Dashboard">
        <Image src="/pwa-icon-72.png" alt="" width={32} height={32} />
        <span>{platform.brandName}</span>
      </Link>
      <Link href="/app/account" className={['subscription-badge', subscriptionLabel.toLowerCase()].join(' ')}>
        {subscriptionLabel}
      </Link>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary workspace navigation">
      {primaryNavigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link key={item.id} href={item.href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
