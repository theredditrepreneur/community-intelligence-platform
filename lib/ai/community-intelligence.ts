import OpenAI from 'openai';

export type AnalyseInput = {
  brandName: string;
  website: string;
  platform: string;
  conversationText: string;
  competitors: string;
  targetCustomer: string;
  strategicGoal: string;
};

export type DiscoverInput = {
  brandName: string;
  website: string;
  companyDescription: string;
  idealCustomers: string;
  competitors: string;
  keywords: string;
  platformsToSearch: string[];
  searchDepth: string;
  timeframe: string;
  retrievedSources?: Array<{
    title: string;
    subreddit: string;
    url: string;
    excerpt: string;
    score: number;
    comments: number;
    createdAt: string;
  }>;
};

export type BriefInput = {
  briefType: string;
  topic: string;
  industry: string;
  audience: string;
  objective: string;
  platformsToPrioritise: string;
  sourceContext: string;
  keyInsights: string;
  researchGoals: string[];
  tone: string;
  desiredOutputLength: string;
};

export type CommunityIntelligenceLevel =
  | 'Invisible'
  | 'Emerging'
  | 'Trusted'
  | 'Authority'
  | 'Community Leader';

export type CommunityIntelligenceScorecard = {
  overallScore: number;
  level: CommunityIntelligenceLevel;
  confidence: 'High' | 'Medium' | 'Low';
  categories: {
    communityTrust: {
      score: number;
      explanation: string;
      evidence: string[];
    };
    recommendationFrequency: {
      score: number;
      explanation: string;
      evidence: string[];
    };
    sentimentConsistency: {
      score: number;
      explanation: string;
      evidence: string[];
    };
    communityAuthority: {
      score: number;
      explanation: string;
      evidence: string[];
    };
    strategicInsight: {
      score: number;
      explanation: string;
      evidence: string[];
    };
  };
  topStrengths: string[];
  topRisks: string[];
  biggestOpportunity: string;
  executiveRecommendation: string;
  communityToAiAlignment: {
    summary: string;
    alignedThemes: string[];
    gaps: string[];
    likelyAiInfluencingNarratives: string[];
    recommendedActions: string[];
  };
};

export type AnalyseBrief = {
  executiveSummary: string;
  communityIntelligenceScore: number;
  communityIntelligenceScorecard: CommunityIntelligenceScorecard;
  keyFindings: string[];
  painPoints: string[];
  buyingIntent: string[];
  competitorMentions: string[];
  aiSearchOpportunities: string[];
  contentOpportunities: string[];
  recommendedActions: string[];
  businessImpact: string;
  evidence: string[];
  confidenceScore: number;
};

export type DiscoverBrief = {
  executiveSummary: string;
  communityIntelligenceScore: number;
  communityIntelligenceScorecard: CommunityIntelligenceScorecard;
  marketSignals: string[];
  likelyConversationThemes: string[];
  biggestBusinessOpportunities: string[];
  biggestRisks: string[];
  buyingIntentSignals: string[];
  competitorIntelligence: string[];
  aiSearchOpportunities: string[];
  contentRoadmap: string[];
  priorityActions: string[];
  recommendedSearches: string[];
  confidenceScore: number;
};

export type ActionBrief = {
  briefTitle: string;
  executiveSummary: string;
  keyFindings: string[];
  strategicContext: string;
  recommendedActions: string[];
  suggestedContentAssets: string[];
  risksOrWatchouts: string[];
  nextSteps: string[];
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set.');
  }

  return new OpenAI({ apiKey });
}

function getModel() {
  return process.env.OPENAI_MODEL || 'gpt-4.1-mini';
}

function frameworkInstruction(mode: 'analyse' | 'discover') {
  return [
    'You are a senior Community Intelligence consultant using The Redditrepreneur Framework.',
    'Your work must sound specific, commercially aware and useful to founders, marketers, product leaders and strategy teams.',
    'Do not write generic marketing advice.',
    'Every recommendation must answer: what did we find, why does it matter commercially, and what should the business do next.',
    mode === 'discover'
      ? 'Important: Discover currently uses supported public Reddit search results only. Do not claim YouTube, LinkedIn, TikTok, X, reviews, forums or the whole web were searched. Ground the brief in supplied retrievedSources when available, and be explicit when source coverage is limited.'
      : 'Ground the brief in the pasted conversation text. Use evidence only from the supplied text and be clear when confidence is limited.',
    'Include a Community Intelligence Scorecard. This is not a sentiment score. It measures community trust, recommendation behaviour, consistency of perception, authority and strategic insight.',
    'Score five categories out of 20: communityTrust, recommendationFrequency, sentimentConsistency, communityAuthority and strategicInsight. The overall score must be the sum of those five category scores, out of 100.',
    'Assign exactly one level from these thresholds: 0-19 Invisible, 20-39 Emerging, 40-59 Trusted, 60-79 Authority, 80-100 Community Leader.',
    'Score confidence as High, Medium or Low based on evidence volume, recency, source diversity and consistency.',
    'Do not invent evidence. Use exact quotes or concise excerpts when available. If evidence is weak or insufficient, say so clearly and score conservatively.',
    'The Community to AI Alignment section should explain how community themes may influence AI-generated answers and where AI discovery may be misaligned, outdated or incomplete.',
    'Return only valid JSON. Do not wrap the JSON in markdown.',
  ].join('\n');
}

const scorecardSchemaInstruction = `communityIntelligenceScorecard object with exactly:
overallScore number from 0 to 100,
level one of "Invisible", "Emerging", "Trusted", "Authority", "Community Leader",
confidence one of "High", "Medium", "Low",
categories object with:
  communityTrust { score number from 0 to 20, explanation string, evidence array of exact quotes or concise excerpts },
  recommendationFrequency { score number from 0 to 20, explanation string, evidence array of exact quotes or concise excerpts },
  sentimentConsistency { score number from 0 to 20, explanation string, evidence array of exact quotes or concise excerpts },
  communityAuthority { score number from 0 to 20, explanation string, evidence array of exact quotes or concise excerpts },
  strategicInsight { score number from 0 to 20, explanation string, evidence array of exact quotes or concise excerpts },
topStrengths array of exactly 3 strings,
topRisks array of exactly 3 strings,
biggestOpportunity string,
executiveRecommendation string,
communityToAiAlignment object with:
  summary string,
  alignedThemes array of strings,
  gaps array of strings,
  likelyAiInfluencingNarratives array of strings,
  recommendedActions array of strings.`;

function extractJson<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error('The AI response was not valid JSON.');
    }

    return JSON.parse(match[0]) as T;
  }
}

async function generateJson<T>(system: string, user: string) {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: getModel(),
    temperature: 0.35,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error('The AI did not return a brief.');
  }

  return extractJson<T>(content);
}

export async function generateAnalyseBrief(input: AnalyseInput) {
  return generateJson<AnalyseBrief>(
    frameworkInstruction('analyse'),
    `Create an Analyse-mode Community Intelligence Brief.

Return JSON with exactly these keys:
executiveSummary string,
communityIntelligenceScore number from 0 to 100,
${scorecardSchemaInstruction}
keyFindings array of strings,
painPoints array of strings,
buyingIntent array of strings,
competitorMentions array of strings,
aiSearchOpportunities array of strings,
contentOpportunities array of strings,
recommendedActions array of strings,
businessImpact string,
evidence array of short quoted or paraphrased evidence points from the supplied conversation,
confidenceScore number from 0 to 100.

Set communityIntelligenceScore to the same value as communityIntelligenceScorecard.overallScore.

Input:
${JSON.stringify(input, null, 2)}`
  );
}

export async function generateDiscoverBrief(input: DiscoverInput) {
  return generateJson<DiscoverBrief>(
    frameworkInstruction('discover'),
    `Create a Discover-mode Community Intelligence research brief.

Return JSON with exactly these keys:
executiveSummary string,
communityIntelligenceScore number from 0 to 100,
${scorecardSchemaInstruction}
marketSignals array of strings,
likelyConversationThemes array of strings,
biggestBusinessOpportunities array of strings,
biggestRisks array of strings,
buyingIntentSignals array of strings,
competitorIntelligence array of strings,
aiSearchOpportunities array of strings,
contentRoadmap array of strings,
priorityActions array of strings,
recommendedSearches array of strings,
confidenceScore number from 0 to 100.

Set communityIntelligenceScore to the same value as communityIntelligenceScorecard.overallScore.

Input:
${JSON.stringify(input, null, 2)}`
  );
}

export async function generateActionBrief(input: BriefInput) {
  return generateJson<ActionBrief>(
    [
      'You are a senior Community Intelligence strategist for The Redditrepreneur.',
      'Create action ready documents for marketing, product, leadership and content teams.',
      'Use The Redditrepreneur Framework: turn observed community signals into commercial meaning and clear next actions.',
      'Do not write filler. Every section must be specific to the topic, audience, objective and supplied context.',
      'Return only valid JSON. Do not wrap the JSON in markdown.',
    ].join('\n'),
    `Create a ${input.briefType} from the supplied context.

Return JSON with exactly these keys:
briefTitle string,
executiveSummary string,
keyFindings array of strings,
strategicContext string,
recommendedActions array of strings,
suggestedContentAssets array of strings,
risksOrWatchouts array of strings,
nextSteps array of strings.

Each recommendation should make clear:
- what was found,
- why it matters commercially,
- what the business should do next.

Use these source-generator principles when shaping the brief:
- identify the most important research questions,
- name the community signals worth tracking,
- suggest relevant communities or platforms to investigate when useful,
- include competitor intelligence scope where relevant,
- define success metrics for the brief's objective,
- position the next step as deeper Community Intelligence work, not as a generic marketing task.

Input:
${JSON.stringify(input, null, 2)}`
  );
}
