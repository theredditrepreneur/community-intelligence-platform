import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { PendingFreeScore } from './session';

export function hasScorecardPersistence() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export async function saveClaimedScorecard(userId: string, pending: PendingFreeScore) {
  const supabase = createSupabaseAdminClient();
  const dimensions = pending.result.dimensions;
  const row = {
    user_id: userId, company_name: pending.request.companyName, normalized_domain: pending.request.normalizedDomain,
    website_url: pending.request.website, industry: pending.request.industry || null, primary_competitor: pending.request.competitor || null,
    status: pending.result.status, demonstration: pending.result.demonstration, overall_score: pending.result.overallScore,
    score_tier: pending.result.tier, overall_confidence: pending.result.confidence,
    community_presence: dimensions.communityPresence.score, community_trust: dimensions.communityTrust.score,
    share_of_consensus: dimensions.shareOfConsensus.score, insight_responsiveness: dimensions.insightResponsiveness.score,
    community_authority: dimensions.communityAuthority.score, dimension_results: dimensions,
    conversation_count: pending.result.conversationCount, source_count: pending.result.conversationCount,
    community_count: pending.result.communities.length, date_range_start: pending.result.dateRange.start, date_range_end: pending.result.dateRange.end,
    data_freshness_at: pending.result.dateRange.end, findings: { keyInsight: pending.result.keyInsight },
    recommendations: [pending.result.recommendedAction], share_of_consensus_result: pending.result.shareOfConsensus,
    source_metadata: { communities: pending.result.communities, provider: pending.result.demonstration ? 'fixture' : 'configured' },
    methodology_version: pending.result.methodologyVersion, claimed_at: new Date().toISOString(), expires_at: null,
  };
  const { data, error } = await supabase.from('community_scorecards').insert(row).select('id').single();
  if (error) throw error;
  return data.id as string;
}

export async function listUserScorecards(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('community_scorecards').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getUserScorecard(userId: string, id: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('community_scorecards').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}
