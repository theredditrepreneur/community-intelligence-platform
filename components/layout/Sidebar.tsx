'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { navigation } from '@/lib/config/navigation';
import { platform } from '@/lib/config/platform';

export function Sidebar() {
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
          <UserButton afterSignOutUrl="/pricing" />
        </SignedIn>
      </div>
      <div className="side-copy">
        <strong>{platform.tagline}</strong>
        {platform.sidebarBody}
      </div>
    </aside>
  );
}
