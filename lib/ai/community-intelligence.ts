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
};

export type BriefInput = {
  briefType: string;
  topic: string;
  audience: string;
  objective: string;
  sourceContext: string;
  keyInsights: string;
  tone: string;
  desiredOutputLength: string;
};

export type AnalyseBrief = {
  executiveSummary: string;
  communityIntelligenceScore: number;
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
      ? 'Important: do not claim you scraped, searched or accessed live platforms. Produce a realistic research brief based only on the supplied brand inputs, competitors, keywords, platforms, search depth and timeframe.'
      : 'Ground the brief in the pasted conversation text. Use evidence only from the supplied text and be clear when confidence is limited.',
    'Return only valid JSON. Do not wrap the JSON in markdown.',
  ].join('\n');
}

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

Input:
${JSON.stringify(input, null, 2)}`
  );
}

export async function generateActionBrief(input: BriefInput) {
  return generateJson<ActionBrief>(
    [
      'You are a senior Community Intelligence strategist for The Redditrepreneur.',
      'Create action-ready documents for marketing, product, leadership and content teams.',
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

Input:
${JSON.stringify(input, null, 2)}`
  );
}
