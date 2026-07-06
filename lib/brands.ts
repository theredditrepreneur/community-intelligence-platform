import { redirect } from 'next/navigation';
import { createSupabaseServerClient, getCurrentUser } from '@/lib/supabase/server';

export type BrandProfile = {
  id: string;
  userId: string;
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  companyDescription: string;
  idealCustomers: string;
  competitors: string;
  keywords: string;
  goals: string[];
  preferredPlatforms: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type BrandProfileInput = Omit<BrandProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

type BrandRow = {
  id: string;
  user_id: string;
  company_name: string;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  company_description: string | null;
  ideal_customers: string | null;
  competitors: string | null;
  keywords: string | null;
  goals: string[] | null;
  preferred_platforms: string[] | null;
  created_at: string;
  updated_at: string;
};

function fromBrandRow(row?: BrandRow | null): BrandProfile | null {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    website: row.website || '',
    industry: row.industry || '',
    companySize: row.company_size || '',
    companyDescription: row.company_description || '',
    idealCustomers: row.ideal_customers || '',
    competitors: row.competitors || '',
    keywords: row.keywords || '',
    goals: row.goals || [],
    preferredPlatforms: row.preferred_platforms || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toBrandRow(userId: string, input: BrandProfileInput) {
  return {
    user_id: userId,
    company_name: input.companyName,
    website: input.website || null,
    industry: input.industry || null,
    company_size: input.companySize || null,
    company_description: input.companyDescription || null,
    ideal_customers: input.idealCustomers || null,
    competitors: input.competitors || null,
    keywords: input.keywords || null,
    goals: input.goals,
    preferred_platforms: input.preferredPlatforms,
    updated_at: new Date().toISOString(),
  };
}

export async function getCurrentBrandProfile() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle<BrandRow>();

  if (error) return null;

  return fromBrandRow(data);
}

export async function requireBrandProfile() {
  const brand = await getCurrentBrandProfile();

  if (!brand) {
    redirect('/app/onboarding');
  }

  return brand;
}

export async function upsertCurrentBrandProfile(input: BrandProfileInput) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = createSupabaseServerClient();
  const existing = await getCurrentBrandProfile();
  const row = toBrandRow(user.id, input);

  const query = existing
    ? supabase.from('brands').update(row).eq('id', existing.id).select('*').single<BrandRow>()
    : supabase.from('brands').insert(row).select('*').single<BrandRow>();

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return fromBrandRow(data);
}
