'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/config/navigation';
import { platform } from '@/lib/config/platform';
import { signOut } from '@/lib/auth-actions';

type SidebarProps = {
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover';
  user: {
    email?: string;
    name?: string;
  };
};

function AccountMenu({ subscriptionLabel, user }: SidebarProps) {
  const displayName = user.name || user.email || 'Account';
  const email = user.email || 'Signed in';

  return (
    <div className="account-menu">
      <Link href="/app/account" className="account-identity">
        <span className="account-avatar">{displayName.charAt(0).toUpperCase()}</span>
        <span>
          <strong>{displayName}</strong>
          <small>{email}</small>
        </span>
      </Link>
      <span className={['subscription-badge', subscriptionLabel.toLowerCase()].join(' ')}>{subscriptionLabel}</span>
      <div className="account-links">
        <Link href="/app/profile">Profile</Link>
        <Link href="/app/billing">Billing</Link>
        <a href="/api/stripe/portal">Manage Billing</a>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({ subscriptionLabel, user }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand">
        <Image src="/redditrepreneur-logo.png" alt="The Redditrepreneur logo" width={34} height={34} />
        <div>
          <strong>{platform.brandName}</strong>
          <span>{platform.shortName}</span>
        </div>
      </div>
      <div className="divider" />
      <nav aria-label="Workspace navigation">
        {navigation.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.id} href={item.href} className={['nav-item', item.accent, active ? 'active' : ''].join(' ')}>
              <span className="nav-title">{item.icon} {item.label}</span>
              <span className="nav-desc">{item.description}</span>
            </Link>
          );
        })}
      </nav>
      <div />
      <div className="sidebar-account">
        <AccountMenu subscriptionLabel={subscriptionLabel} user={user} />
      </div>
      <div className="side-copy">
        <strong>{platform.tagline}</strong>
        {platform.sidebarBody}
      </div>
    </aside>
  );
}
