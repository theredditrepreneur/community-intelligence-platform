import { BrandProfileForm } from '@/components/brand/BrandProfileForm';
import { getCurrentBrandProfile } from '@/lib/brands';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage({ searchParams }: { searchParams?: { error?: string } }) {
  const brand = await getCurrentBrandProfile();
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : undefined;

  return (
    <>
      <section className="hero onboarding-hero">
        <div className="eyebrow">Brand Profile</div>
        <div className="question">Set your intelligence context once.</div>
        <h1>{brand ? 'Update your Brand Profile' : 'Create your Brand Profile'}</h1>
        <p>Your saved company context powers Dashboard, Analyse, Discover, Action Centre and future Alerts.</p>
      </section>

      <BrandProfileForm brand={brand} error={error} />
    </>
  );
}
