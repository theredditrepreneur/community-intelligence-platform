'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type PricingPlan = {
  id?: string;
  headline: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  badge?: string;
  recommended?: boolean;
  status: string;
};

function getSignedOutHref(plan: PricingPlan) {
  if (plan.status === 'coming-soon') return plan.href;
  return '/sign-up?redirect_url=' + encodeURIComponent(plan.href);
}

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article className={['price-card', plan.recommended ? 'recommended' : '', plan.status === 'coming-soon' ? 'soon' : ''].join(' ')}>
      {plan.badge ? <Badge tone={plan.recommended ? 'orange' : 'green'}>{plan.badge}</Badge> : null}
      <h3>{plan.headline}</h3>
      <div className="price">{plan.price}{plan.cadence ? <span>{plan.cadence}</span> : null}</div>
      <p>{plan.description}</p>
      <ul>
        {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      {plan.status === 'coming-soon' ? (
        <Button href={plan.href} variant="secondary">{plan.cta}</Button>
      ) : (
        <>
          <SignedIn>
            <Button href={plan.href} variant="orange">{plan.cta}</Button>
          </SignedIn>
          <SignedOut>
            <Button href={getSignedOutHref(plan)} variant="orange">{plan.cta}</Button>
          </SignedOut>
        </>
      )}
    </article>
  );
}
