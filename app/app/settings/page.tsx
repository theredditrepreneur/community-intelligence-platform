import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Settings</div>
        <h1>Settings</h1>
        <p>Manage your account profile and workspace preferences.</p>
      </section>

      <section className="panel account-panel">
        <h2>Account settings</h2>
        <p className="helper">Profile and security settings are managed through your Supabase account session.</p>
        <div className="account-actions">
          <Button href="/app/profile" variant="secondary">Edit profile</Button>
          <Button href="/app/billing" variant="secondary">Billing</Button>
        </div>
      </section>
    </>
  );
}
