import { Button } from '@/components/ui/Button';
import { getCurrentSubscription, hasAdminAccess } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const subscription = await getCurrentSubscription();
  const isAdmin = hasAdminAccess(subscription);

  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Billing</div>
        <h1>Billing</h1>
        <p>Manage your Analyse or Discover subscription through Stripe&apos;s secure customer portal.</p>
      </section>

      <section className="panel account-panel">
        <h2>Subscription management</h2>
        <p className="helper">
          {isAdmin
            ? 'Admin access enabled. Stripe billing is still reserved for real customer subscriptions.'
            : 'Open Stripe Billing to update payment details, view invoices or manage your subscription.'}
        </p>
        <div className="account-actions">
          {isAdmin ? null : <a className="btn btn-primary" href="/api/stripe/portal">Manage Billing</a>}
          <Button href="/pricing" variant="secondary">View plans</Button>
        </div>
      </section>
    </>
  );
}
