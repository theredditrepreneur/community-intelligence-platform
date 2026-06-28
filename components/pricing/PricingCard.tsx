import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckoutButton } from './CheckoutButton';

type PricingPlan = {
  id?: 'analyse' | 'discover' | 'alerts';
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

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const isPaidTier = plan.id === 'analyse' || plan.id === 'discover';

  return (
    <article className={['price-card', plan.recommended ? 'recommended' : '', plan.status === 'coming-soon' ? 'soon' : ''].join(' ')}>
      {plan.badge ? <Badge tone={plan.recommended ? 'orange' : 'green'}>{plan.badge}</Badge> : null}
      <h3>{plan.headline}</h3>
      <div className="price">{plan.price}{plan.cadence ? <span>{plan.cadence}</span> : null}</div>
      <p>{plan.description}</p>
      <ul>
        {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      {isPaidTier ? <CheckoutButton plan={plan.id}>{plan.cta}</CheckoutButton> : <Button href={plan.href} variant="secondary">{plan.cta}</Button>}
    </article>
  );
}
