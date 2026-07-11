import type { CommunityEvidence, ScoreRequest } from './types';

export type ProviderLimits = { maxSearches: number; maxPosts: number; maxComments: number; windowDays: number };
export type ProviderResult = { evidence: CommunityEvidence[]; provider: string; demonstration: boolean };

export interface CommunityDataProvider {
  readonly id: string;
  search(request: ScoreRequest, limits: ProviderLimits): Promise<ProviderResult>;
}

const fixtureThemes = [
  ['r/startups', 0.8, 0.7, 0.1, 0.5, true], ['r/smallbusiness', 0.6, 0.4, 0, 0.4, true],
  ['r/marketing', 0.7, 0.5, 0.4, 0.7, true], ['r/entrepreneur', 0.5, 0.2, 0, 0.2, false],
  ['r/SaaS', 0.9, 0.8, 0.5, 0.8, true], ['r/productmanagement', 0.3, -0.2, 0.7, 0.2, false],
  ['r/growmybusiness', 0.6, 0.5, 0.2, 0.5, true], ['r/digital_marketing', 0.7, 0.6, 0, 0.6, true],
] as const;

export class FixtureCommunityDataProvider implements CommunityDataProvider {
  readonly id = 'fixture';
  async search(request: ScoreRequest, limits: ProviderLimits): Promise<ProviderResult> {
    const competitor = request.competitor || 'Example Competitor';
    const evidence = fixtureThemes.slice(0, limits.maxPosts).map((theme, index) => ({
      id: `fixture-${index + 1}`, provider: this.id, externalId: `fixture-post-${index + 1}`,
      url: `https://example.invalid/community-source-${index + 1}`, community: theme[0],
      publishedAt: new Date(Date.now() - (index + 2) * 86400000).toISOString(),
      excerpt: index % 3 === 0 ? `Demonstration discussion recommends ${request.companyName} alongside ${competitor}.` : `Demonstration community evidence about ${request.industry || 'the category'}.`,
      relevance: 0.75 + (index % 3) * 0.05, organicMention: true, recommendationStrength: theme[1], trustPolarity: theme[2],
      responsivenessStrength: theme[3], authorityStrength: theme[4], namedBrands: index % 3 === 0 ? [request.companyName, competitor] : [request.companyName], qualifyingRecommendation: theme[5],
    }));
    return { evidence, provider: this.id, demonstration: true };
  }
}

export class RedditOAuthCommunityDataProvider implements CommunityDataProvider {
  readonly id = 'reddit-oauth';
  async search(): Promise<ProviderResult> {
    throw new Error('Authenticated Reddit access is not configured or approved. Live scoring remains disabled.');
  }
}
