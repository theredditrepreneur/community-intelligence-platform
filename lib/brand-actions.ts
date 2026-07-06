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

function brandSaveErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unable to save Brand Profile.';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('brands') && (lowerMessage.includes('does not exist') || lowerMessage.includes('schema cache'))) {
    return 'The Brand Profile database table is not set up yet. Please apply the Supabase schema update, then try again.';
  }

  if (lowerMessage.includes('row-level security') || lowerMessage.includes('violates row-level security')) {
    return 'Supabase blocked the Brand Profile save. Please check the brands table security policies.';
  }

  return message;
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

  try {
    await upsertCurrentBrandProfile(input);
  } catch (error) {
    redirect('/app/onboarding?error=' + encodeURIComponent(brandSaveErrorMessage(error)));
  }

  redirect('/app/dashboard');
}
