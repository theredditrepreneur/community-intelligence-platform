'use server';

import { redirect } from 'next/navigation';
import { upsertCurrentBrandProfile, type BrandProfileInput } from '@/lib/brands';

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

function selectedValues(formData: FormData, key: string, allowed: string[]) {
  return formData
    .getAll(key)
    .map((value) => String(value))
    .filter((value) => allowed.includes(value));
}

export async function saveBrandProfile(formData: FormData) {
  const input: BrandProfileInput = {
    companyName: String(formData.get('companyName') || '').trim(),
    website: String(formData.get('website') || '').trim(),
    industry: String(formData.get('industry') || '').trim(),
    companySize: String(formData.get('companySize') || '').trim(),
    companyDescription: String(formData.get('companyDescription') || '').trim(),
    idealCustomers: String(formData.get('idealCustomers') || '').trim(),
    competitors: String(formData.get('competitors') || '').trim(),
    keywords: String(formData.get('keywords') || '').trim(),
    goals: selectedValues(formData, 'goals', goals),
    preferredPlatforms: selectedValues(formData, 'preferredPlatforms', platforms),
  };

  if (!input.companyName) {
    redirect('/app/onboarding?error=' + encodeURIComponent('Company name is required.'));
  }

  await upsertCurrentBrandProfile(input);
  redirect('/app/dashboard');
}
