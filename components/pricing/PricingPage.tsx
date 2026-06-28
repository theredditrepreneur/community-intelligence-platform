import Image from 'next/image';
import { PricingTable, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { pricingPlans, pricingValueStatements } from '@/lib/config/pricing';
import { platform } from '@/lib/config/platform';
import { PricingCard } from './PricingCard';

export function PricingPage() {
  return (
    <main className="public-main">
      <section className="pricing-section" id="pricing">
        <div className="brand" style={{ marginBottom: 22 }}>
          <Image src="/redditrepreneur-logo.png" alt="The Redditrepreneur logo" width={34} height={34} />
          <div>
            <strong>{platform.brandName}</strong>
            <span>{platform.shortName}</span>
          </div>
        </div>
        <div className="public-auth">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="auth-link" type="button">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="auth-cta" type="button">Create account</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button href="/app/analyse" variant="secondary">Open app</Button>
            <UserButton afterSignOutUrl="/pricing" />
          </SignedIn>
        </div>
        <div className="pricing-header">
          <div className="eyebrow">Plans</div>
          <h1>Choose how you want to understand your market.</h1>
          <p>{platform.productName} turns online community conversations into executive ready intelligence for marketing, product and strategic decisions.</p>
        </div>
        <div className="value-row">
          {pricingValueStatements.map((statement) => <span className="value-pill" key={statement}>{statement}</span>)}
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => <PricingCard key={plan.id} plan={plan} />)}
        </div>
        <section className="clerk-billing-panel" id="clerk-billing" aria-label="Subscribe with Clerk Billing">
          <div>
            <div className="eyebrow">Secure Checkout</div>
            <h2>Subscribe with Clerk Billing</h2>
            <p>Choose Analyse or Discover below. Clerk handles account creation, payment and subscription access in one flow.</p>
          </div>
          <PricingTable />
        </section>
      </section>
    </main>
  );
}
