import { FixtureCommunityDataProvider } from './providers';
import { calculateCommunityScore } from './methodology';

export async function createFixtureScore(companyName: string, competitor?: string, industry?: string) {
  const provider = new FixtureCommunityDataProvider();
  const result = await provider.search({ companyName, website: 'https://example.invalid', competitor, industry }, { maxSearches: 6, maxPosts: 30, maxComments: 60, windowDays: 90 });
  return calculateCommunityScore(result.evidence, companyName, true);
}
