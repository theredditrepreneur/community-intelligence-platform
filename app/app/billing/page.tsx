import { Button } from '@/components/ui/Button';

export default function BillingPage() {
  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Billing</div>
        <h1>Billing</h1>
        <p>Manage your subscription through Clerk Billing inside your account profile.</p>
      </section>

      <section className="panel account-panel">
        <h2>Subscription management</h2>
        <p className="helper">Open your profile to manage your current plan, payment method and billing settings.</p>
        <div className="account-actions">
          <Button href="/app/profile/billing">Manage Billing</Button>
          <Button href="/pricing" variant="secondary">View plans</Button>
        </div>
      </section>
    </>
  );
}
