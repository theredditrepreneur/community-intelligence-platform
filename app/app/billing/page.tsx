import { Button } from '@/components/ui/Button';

export default function BillingPage() {
  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Billing</div>
        <h1>Billing</h1>
        <p>Manage your Analyse or Discover subscription through Stripe's secure customer portal.</p>
      </section>

      <section className="panel account-panel">
        <h2>Subscription management</h2>
        <p className="helper">Open Stripe Billing to update payment details, view invoices or manage your subscription.</p>
        <div className="account-actions">
          <a className="btn btn-primary" href="/api/stripe/portal">Manage Billing</a>
          <Button href="/pricing" variant="secondary">View plans</Button>
        </div>
      </section>
    </>
  );
}
