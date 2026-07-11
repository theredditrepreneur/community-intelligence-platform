import { dimensionKeys, type CommunityEvidence, type CommunityScorecardResult, type ConfidenceState, type DimensionKey, type DimensionResult } from './types';

export const communityScoreMethodology = {
  version: 'community-score-v1' as const,
  minimumOverallEvidence: 5,
  minimumConsensusEvidence: 5,
  dimensions: {
    communityPresence: { mentionVolume: 0.4, recency: 0.25, communityBreadth: 0.2, organicRate: 0.15 },
    communityTrust: { recommendationStrength: 0.4, trustPolarity: 0.35, consistency: 0.25 },
    shareOfConsensus: { qualifyingRecommendationShare: 0.7, sampleStrength: 0.3 },
    insightResponsiveness: { responseEvidence: 0.7, breadth: 0.3 },
    communityAuthority: { authorityEvidence: 0.5, repeatedRecommendations: 0.3, breadth: 0.2 },
  },
};

const labels: Record<DimensionKey, string> = {
  communityPresence: 'Community Presence', communityTrust: 'Community Trust', shareOfConsensus: 'Share of Consensus',
  insightResponsiveness: 'Insight Responsiveness', communityAuthority: 'Community Authority',
};

const clamp = (value: number, min = 0, max = 20) => Math.max(min, Math.min(max, Math.round(value)));
const average = (items: number[]) => items.length ? items.reduce((a, b) => a + b, 0) / items.length : 0;

function confidence(count: number, communities: number): ConfidenceState {
  if (count < 2) return 'insufficient';
  if (count < 5 || communities < 2) return 'low';
  if (count < 12 || communities < 3) return 'moderate';
  return 'high';
}

function dimension(score: number, evidence: CommunityEvidence[], explanation: string): DimensionResult {
  return {
    score: clamp(score), confidence: confidence(evidence.length, new Set(evidence.map((item) => item.community)).size),
    evidenceCount: evidence.length, explanation, evidenceSummary: evidence.slice(0, 3).map((item) => item.excerpt),
  };
}

function tier(score: number, confidenceState: ConfidenceState) {
  const name = score <= 20 ? 'Limited Community Presence' : score <= 40 ? 'Emerging Community Presence' : score <= 60
    ? 'Active Category Presence' : score <= 80 ? 'Strong Community Influence' : 'Category Authority';
  return confidenceState === 'low' || confidenceState === 'insufficient' ? `${name}, limited confidence` : name;
}

export function calculateCommunityScore(evidence: CommunityEvidence[], targetBrand: string, demonstration = false): CommunityScorecardResult {
  const relevant = evidence.filter((item) => item.relevance >= 0.55);
  const communities = [...new Set(relevant.map((item) => item.community))];
  const dates = relevant.map((item) => new Date(item.publishedAt).getTime()).filter(Number.isFinite).sort();
  const now = Date.now();
  const recency = average(relevant.map((item) => Math.max(0, 1 - (now - new Date(item.publishedAt).getTime()) / (90 * 86400000))));
  const organicRate = relevant.length ? relevant.filter((item) => item.organicMention).length / relevant.length : 0;
  const presence = dimension(Math.min(10, relevant.length) + recency * 5 + Math.min(3, communities.length) + organicRate * 2, relevant,
    'Based on relevant organic mention volume, recency and breadth across communities.');
  const trustEvidence = relevant.filter((item) => item.recommendationStrength || item.trustPolarity);
  const trust = dimension((average(trustEvidence.map((item) => item.recommendationStrength)) * 9) + ((average(trustEvidence.map((item) => item.trustPolarity)) + 1) * 4.5) + Math.min(2, trustEvidence.length / 3), trustEvidence,
    'Based on recommendation strength, positive and negative trust signals, and consistency.');
  const qualifying = relevant.filter((item) => item.qualifyingRecommendation);
  const brandCounts = new Map<string, number>();
  qualifying.forEach((item) => [...new Set(item.namedBrands.map((brand) => brand.toLowerCase()))].forEach((brand) => brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1)));
  const denominator = [...brandCounts.values()].reduce((a, b) => a + b, 0);
  const targetCount = brandCounts.get(targetBrand.toLowerCase()) || 0;
  const consensusShare = denominator ? targetCount / denominator : 0;
  const consensus = dimension(consensusShare * 14 + Math.min(6, qualifying.length), qualifying,
    'Counts only brands recommended in qualifying category recommendation conversations.');
  const responsiveEvidence = relevant.filter((item) => item.responsivenessStrength > 0);
  const responsiveness = dimension(average(responsiveEvidence.map((item) => item.responsivenessStrength)) * 14 + Math.min(6, new Set(responsiveEvidence.map((item) => item.community)).size * 2), responsiveEvidence,
    'Based only on visible evidence of response to concerns, feedback or requests; missing evidence is not treated as responsiveness.');
  const authorityEvidence = relevant.filter((item) => item.authorityStrength > 0 || item.qualifyingRecommendation);
  const authority = dimension(average(authorityEvidence.map((item) => item.authorityStrength)) * 10 + Math.min(6, authorityEvidence.length) + Math.min(4, new Set(authorityEvidence.map((item) => item.community)).size), authorityEvidence,
    'Based on repeated organic recommendations, expertise associations and inclusion in trusted shortlists.');
  const dimensions = { communityPresence: presence, communityTrust: trust, shareOfConsensus: consensus, insightResponsiveness: responsiveness, communityAuthority: authority };
  const overallConfidence = confidence(relevant.length, communities.length);
  const insufficient = relevant.length < communityScoreMethodology.minimumOverallEvidence;
  const overallScore = insufficient ? null : dimensionKeys.reduce((sum, key) => sum + dimensions[key].score, 0);
  const ranked = insufficient ? [] : [...dimensionKeys].sort((a, b) => dimensions[b].score - dimensions[a].score);
  const share = qualifying.length >= communityScoreMethodology.minimumConsensusEvidence && denominator
    ? Object.fromEntries([...brandCounts].map(([brand, count]) => [brand, Math.round(count / denominator * 100)])) : null;
  return {
    methodologyVersion: communityScoreMethodology.version, demonstration, status: insufficient ? 'insufficient_data' : 'completed',
    overallScore, tier: insufficient ? 'Limited Community Data' : tier(overallScore!, overallConfidence), confidence: overallConfidence,
    dimensions, conversationCount: relevant.length, communities,
    dateRange: { start: dates.length ? new Date(dates[0]).toISOString() : new Date(now - 90 * 86400000).toISOString(), end: dates.length ? new Date(dates[dates.length - 1]).toISOString() : new Date(now).toISOString() },
    strongestDimension: ranked[0] || null, weakestDimension: ranked[ranked.length - 1] || null,
    keyInsight: insufficient ? 'The available community evidence is too limited for a reliable numerical score.' : `${labels[ranked[0]]} is the strongest observed dimension in this sample.`,
    recommendedAction: insufficient ? 'Broaden the category terms or add a competitor before running a deeper Discover report.' : `Prioritise ${labels[ranked[ranked.length - 1]]} and validate the finding with a deeper Discover report.`,
    shareOfConsensus: share,
  };
}
