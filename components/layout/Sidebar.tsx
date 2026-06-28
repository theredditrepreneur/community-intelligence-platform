'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { navigation } from '@/lib/config/navigation';
import { platform } from '@/lib/config/platform';

type SidebarProps = {
  subscriptionLabel: 'Free' | 'Analyse' | 'Discover';
};

function AccountMenu({ subscriptionLabel }: SidebarProps) {
  const { user } = useUser();
  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Account';
  const email = user?.primaryEmailAddress?.emailAddress || 'Signed in';

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
        <SignOutButton redirectUrl="/pricing">
          <button type="button">Sign out</button>
        </SignOutButton>
      </div>
    </div>
  );
}

export function Sidebar({ subscriptionLabel }: SidebarProps) {
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
        <SignedOut>
          <SignInButton mode="modal">
            <button className="account-button" type="button">Sign in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <AccountMenu subscriptionLabel={subscriptionLabel} />
        </SignedIn>
      </div>
      <div className="side-copy">
        <strong>{platform.tagline}</strong>
        {platform.sidebarBody}
      </div>
    </aside>
  );
}
