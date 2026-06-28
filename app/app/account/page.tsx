import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : undefined;
  const name = fullName || user?.email || 'Your account';
  const email = user?.email || 'No primary email added yet';

  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Account</div>
        <h1>{name}</h1>
        <p>Manage your Redditrepreneur account, profile details and billing access from one calm place.</p>
      </section>

      <section className="panel account-panel">
        <div className="account-summary">
          <span className="account-avatar large">{name.charAt(0).toUpperCase()}</span>
          <div>
            <h2>Account overview</h2>
            <p>{email}</p>
          </div>
        </div>
        <div className="account-actions">
          <Button href="/app/profile" variant="secondary">Edit profile</Button>
          <Button href="/app/billing" variant="secondary">Billing</Button>
        </div>
      </section>
    </>
  );
}
