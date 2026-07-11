export const dimensionKeys = [
  'communityPresence', 'communityTrust', 'shareOfConsensus', 'insightResponsiveness', 'communityAuthority',
] as const;

export type DimensionKey = (typeof dimensionKeys)[number];
export type ConfidenceState = 'high' | 'moderate' | 'low' | 'insufficient';
export type ScorecardStatus = 'queued' | 'searching' | 'analysing' | 'completed' | 'insufficient_data' | 'failed';

export type CommunityEvidence = {
  id: string;
  provider: string;
  externalId: string;
  url: string;
  community: string;
  publishedAt: string;
  excerpt: string;
  relevance: number;
  organicMention: boolean;
  recommendationStrength: number;
  trustPolarity: number;
  responsivenessStrength: number;
  authorityStrength: number;
  namedBrands: string[];
  qualifyingRecommendation: boolean;
};

export type DimensionResult = {
  score: number;
  confidence: ConfidenceState;
  evidenceCount: number;
  explanation: string;
  evidenceSummary: string[];
};

export type CommunityScorecardResult = {
  methodologyVersion: 'community-score-v1';
  demonstration: boolean;
  status: 'completed' | 'insufficient_data';
  overallScore: number | null;
  tier: string;
  confidence: ConfidenceState;
  dimensions: Record<DimensionKey, DimensionResult>;
  conversationCount: number;
  communities: string[];
  dateRange: { start: string; end: string };
  strongestDimension: DimensionKey | null;
  weakestDimension: DimensionKey | null;
  keyInsight: string;
  recommendedAction: string;
  shareOfConsensus: Record<string, number> | null;
};

export type ScoreRequest = {
  companyName: string;
  website: string;
  competitor?: string;
  industry?: string;
  turnstileToken?: string;
  attribution?: Record<string, string>;
};
