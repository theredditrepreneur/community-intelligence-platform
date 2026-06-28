import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { pricingPlans, pricingValueStatements } from '@/lib/config/pricing';
import { platform } from '@/lib/config/platform';
import { getCurrentUser } from '@/lib/supabase/server';
import { signOut } from '@/lib/auth-actions';
import { getCurrentSubscription, getSubscriptionAppPath } from '@/lib/subscription';
import { PricingCard } from './PricingCard';

export async function PricingPage() {
  const user = await getCurrentUser();
  const subscription = user ? await getCurrentSubscription() : {};
  const appPath = getSubscriptionAppPath(subscription);

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
          {user ? (
            <>
              <Button href={appPath} variant="secondary">Open app</Button>
              <form action={signOut}>
                <button className="auth-link" type="submit">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Button href="/sign-in" variant="secondary">Sign in</Button>
              <Button href="/sign-up">Create account</Button>
            </>
          )}
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
      </section>
    </main>
  );
}
