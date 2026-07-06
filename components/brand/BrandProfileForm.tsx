import { Button } from '@/components/ui/Button';
import { saveBrandProfile } from '@/lib/brand-actions';
import type { BrandProfile } from '@/lib/brands';

const goals = [
  'Brand Awareness',
  'AI Search Visibility',
  'Content Ideas',
  'Product Research',
  'Competitor Intelligence',
  'Customer Research',
  'Community Monitoring',
];

const platforms = ['Reddit', 'YouTube', 'TikTok', 'LinkedIn', 'X', 'Trustpilot', 'G2', 'Forums'];

function ChipGroup({ name, items, selected }: { name: string; items: string[]; selected: string[] }) {
  return (
    <div className="profile-chip-grid">
      {items.map((item) => (
        <label className="profile-choice" key={item}>
          <input name={name} type="checkbox" value={item} defaultChecked={selected.includes(item)} />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}

export function BrandProfileForm({ brand, error }: { brand?: BrandProfile | null; error?: string }) {
  return (
    <form className="panel brand-profile-form" action={saveBrandProfile}>
      <div className="form-section">
        <span className="dashboard-kicker">Company</span>
        <div className="field-grid">
          <label>Company Name<input name="companyName" defaultValue={brand?.companyName} placeholder="The Redditrepreneur" required /></label>
          <label>Website<input name="website" defaultValue={brand?.website} placeholder="https://yourcompany.com" /></label>
          <label>Industry<input name="industry" defaultValue={brand?.industry} placeholder="SaaS, ecommerce, fintech" /></label>
          <label>Company Size<input name="companySize" defaultValue={brand?.companySize} placeholder="Solo, 2 to 10, 11 to 50" /></label>
          <label className="full">What does your company do?<textarea name="companyDescription" defaultValue={brand?.companyDescription} placeholder="Describe what you sell and the problem you solve." /></label>
          <label className="full">Who are your ideal customers?<textarea name="idealCustomers" defaultValue={brand?.idealCustomers} placeholder="Describe your best fit customers, buyers or users." /></label>
        </div>
      </div>

      <div className="form-section">
        <span className="dashboard-kicker">Market Context</span>
        <div className="field-grid">
          <label className="full">Competitors<textarea name="competitors" defaultValue={brand?.competitors} placeholder="Add known competitors, alternatives or categories buyers compare you with." /></label>
          <label className="full">Keywords<textarea name="keywords" defaultValue={brand?.keywords} placeholder="Add product, category, problem and buying intent keywords." /></label>
        </div>
      </div>

      <div className="form-section">
        <span className="dashboard-kicker">Goals</span>
        <ChipGroup name="goals" items={goals} selected={brand?.goals || ['AI Search Visibility', 'Content Ideas', 'Customer Research']} />
      </div>

      <div className="form-section">
        <span className="dashboard-kicker">Preferred Platforms</span>
        <ChipGroup name="preferredPlatforms" items={platforms} selected={brand?.preferredPlatforms || ['Reddit']} />
      </div>

      {error ? <p className="checkout-error">{error}</p> : null}

      <div className="button-row">
        <Button type="submit" variant="orange">Save Brand Profile</Button>
        <Button href="/app/dashboard" variant="secondary">Back to Dashboard</Button>
      </div>
    </form>
  );
}
