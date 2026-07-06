import { NextResponse } from 'next/server';
import { generateDiscoverBrief, type DiscoverInput } from '@/lib/ai/community-intelligence';
import { requirePlan } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RedditPost = {
  data?: {
    title?: string;
    selftext?: string;
    subreddit?: string;
    permalink?: string;
    url?: string;
    score?: number;
    num_comments?: number;
    created_utc?: number;
  };
};

const redditTimeframes: Record<string, string> = {
  'Past Week': 'week',
  'Past Month': 'month',
  'Past 3 Months': 'year',
  'Past Year': 'year',
  Custom: 'year',
};

const depthLimits: Record<string, number> = {
  'Quick Scan': 8,
  'Standard Search': 14,
  'Deep Community Search': 22,
};

function isValidPayload(payload: Partial<DiscoverInput>) {
  return Boolean(payload.brandName && (payload.keywords || payload.competitors || payload.companyDescription));
}

function buildSearchQuery(payload: Partial<DiscoverInput>) {
  return [
    payload.brandName,
    payload.competitors,
    payload.keywords,
    payload.companyDescription,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

function excerptFrom(post: RedditPost['data']) {
  const text = [post?.title, post?.selftext].filter(Boolean).join('. ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 420);
}

function decodeHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function textBetween(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeHtml(match[1]) : '';
}

function parseRedditRss(xml: string) {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  return entries.map((entry) => {
    const url = entry.match(/<link[^>]+href="([^"]+)"/i)?.[1] || '';
    const subreddit = entry.match(/<category[^>]+label="([^"]+)"/i)?.[1] || 'Reddit';

    return {
      title: textBetween(entry, 'title') || 'Untitled Reddit result',
      subreddit: subreddit.startsWith('r/') ? subreddit : 'Reddit',
      url: decodeHtml(url),
      excerpt: textBetween(entry, 'content').slice(0, 420),
      score: 0,
      comments: 0,
      createdAt: textBetween(entry, 'updated'),
    };
  }).filter((source) => source.url);
}

async function fetchRedditRss(query: string, timeframe: string, limit: number) {
  const url = new URL('https://www.reddit.com/search.rss');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', 'relevance');
  url.searchParams.set('t', timeframe);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TheRedditrepreneurCommunityIntelligence/1.0',
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Reddit search is temporarily unavailable. Please try again in a few minutes.');
  }

  return parseRedditRss(await response.text());
}

async function searchReddit(payload: Partial<DiscoverInput>) {
  const query = buildSearchQuery(payload);

  if (!query) return [];

  const limit = depthLimits[payload.searchDepth || 'Standard Search'] || 14;
  const timeframe = redditTimeframes[payload.timeframe || 'Past Month'] || 'month';
  const url = new URL('https://www.reddit.com/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', 'relevance');
  url.searchParams.set('t', timeframe);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TheRedditrepreneurCommunityIntelligence/1.0',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    return fetchRedditRss(query, timeframe, limit);
  }

  const json = (await response.json().catch(() => null)) as { data?: { children?: RedditPost[] } } | null;

  if (!json) {
    return fetchRedditRss(query, timeframe, limit);
  }

  const seen = new Set<string>();

  return (json.data?.children || [])
    .map((post) => {
      const data = post.data || {};
      const permalink = data.permalink ? `https://www.reddit.com${data.permalink}` : data.url || '';

      return {
        title: data.title || 'Untitled Reddit result',
        subreddit: data.subreddit ? `r/${data.subreddit}` : 'Reddit',
        url: permalink,
        excerpt: excerptFrom(data),
        score: data.score || 0,
        comments: data.num_comments || 0,
        createdAt: data.created_utc ? new Date(data.created_utc * 1000).toISOString() : '',
      };
    })
    .filter((source) => {
      if (!source.url || seen.has(source.url)) return false;
      seen.add(source.url);
      return true;
    });
}

export async function POST(request: Request) {
  await requirePlan('discover');

  const payload = (await request.json().catch(() => ({}))) as Partial<DiscoverInput>;

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { error: 'Brand name and at least one keyword, competitor or business description are required.' },
      { status: 400 }
    );
  }

  try {
    const retrievedSources = await searchReddit(payload);
    const brief = await generateDiscoverBrief({
      brandName: payload.brandName || '',
      website: payload.website || '',
      companyDescription: payload.companyDescription || '',
      idealCustomers: payload.idealCustomers || '',
      competitors: payload.competitors || '',
      keywords: payload.keywords || '',
      platformsToSearch: ['Reddit'],
      searchDepth: payload.searchDepth || 'Standard Search',
      timeframe: payload.timeframe || 'Past Month',
      retrievedSources,
    });

    return NextResponse.json({
      ...brief,
      sourceCoverage: {
        searchedSources: ['Reddit public search'],
        comingLater: ['YouTube', 'TikTok', 'LinkedIn', 'X', 'Trustpilot', 'G2', 'Forums', 'broader public web search'],
        limitation: 'Discover currently searches Reddit public results only. It does not yet search every public community source.',
      },
      retrievedSources,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate the Discover brief.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
