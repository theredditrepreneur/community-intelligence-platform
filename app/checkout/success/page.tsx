import { Button } from '@/components/ui/Button';
import type { PaidPlan } from '@/lib/config/subscriptions';

function getReturnPath(plan?: string) {
  if (plan === 'discover') return '/app/discover';
  return '/app/analyse';
}

function getPlanLabel(plan?: string) {
  if (plan === 'discover') return 'Discover';
  if (plan === 'analyse') return 'Analyse';
  return 'your';
}

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { plan?: PaidPlan } }) {
  const returnPath = getReturnPath(searchParams.plan);
  const planLabel = getPlanLabel(searchParams.plan);

  return (
    <main className="public-main checkout-page">
      <section className="panel checkout-panel">
        <div className="eyebrow">Payment Complete</div>
        <h1>Your {planLabel} workspace is ready.</h1>
        <p>Stripe has confirmed your subscription. If access does not update instantly, refresh after a few seconds while the webhook finishes syncing your account.</p>
        <div className="account-actions">
          <Button href={returnPath}>Open workspace</Button>
          <Button href="/app/billing" variant="secondary">Manage Billing</Button>
        </div>
      </section>
    </main>
  );
}
