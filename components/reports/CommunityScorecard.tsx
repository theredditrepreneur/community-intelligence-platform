import type { CommunityIntelligenceScorecard as Scorecard } from '@/lib/ai/community-intelligence';

const categoryLabels: Record<keyof Scorecard['categories'], string> = {
  communityTrust: 'Community Trust',
  recommendationFrequency: 'Recommendation Frequency',
  sentimentConsistency: 'Sentiment Consistency',
  communityAuthority: 'Community Authority',
  strategicInsight: 'Strategic Insight',
};

function FieldList({ items }: { items?: string[] }) {
  if (!items?.length) return <p>Evidence is limited for this section.</p>;
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function CommunityScorecard({ scorecard }: { scorecard?: Scorecard }) {
  if (!scorecard?.categories || !scorecard.communityToAiAlignment) return null;

  const categories = Object.entries(scorecard.categories) as Array<[keyof Scorecard['categories'], Scorecard['categories'][keyof Scorecard['categories']]]>;

  return (
    <section className="scorecard-section">
      <div className="scorecard-hero">
        <div>
          <div className="eyebrow">Community Intelligence Scorecard</div>
          <h2>{scorecard.overallScore ?? 0}/100</h2>
          <p>Overall Community Intelligence Score</p>
        </div>
        <div className="scorecard-meta">
          <span className="level-badge">{scorecard.level ?? 'Emerging'}</span>
          <span className="confidence-rating">Confidence: {scorecard.confidence ?? 'Low'}</span>
        </div>
      </div>

      <div className="scorecard-category-grid">
        {categories.map(([key, category]) => (
          <article className="scorecard-category" key={key}>
            <div className="scorecard-category-head">
              <h3>{categoryLabels[key]}</h3>
              <strong>{category.score ?? 0}/20</strong>
            </div>
            <div className="scorebar" aria-hidden="true">
              <span style={{ width: `${Math.max(0, Math.min(100, ((category.score ?? 0) / 20) * 100))}%` }} />
            </div>
            <p>{category.explanation || 'Evidence is limited for this category.'}</p>
            <div className="scorecard-evidence">
              <span>Evidence summary</span>
              <FieldList items={category.evidence} />
            </div>
          </article>
        ))}
      </div>

      <div className="scorecard-insight-grid">
        <article className="finding">
          <h3>Top Community Strengths</h3>
          <FieldList items={scorecard.topStrengths} />
        </article>
        <article className="finding">
          <h3>Top Community Risks</h3>
          <FieldList items={scorecard.topRisks} />
        </article>
        <article className="finding featured-finding">
          <h3>Biggest Strategic Opportunity</h3>
          <p>{scorecard.biggestOpportunity}</p>
        </article>
        <article className="finding featured-finding">
          <h3>Executive Recommendation</h3>
          <p>{scorecard.executiveRecommendation}</p>
        </article>
      </div>

      <article className="finding ai-alignment-card">
        <h3>Community to AI Alignment</h3>
        <p>{scorecard.communityToAiAlignment.summary}</p>
        <div className="alignment-grid">
          <div>
            <h4>Aligned Themes</h4>
            <FieldList items={scorecard.communityToAiAlignment.alignedThemes} />
          </div>
          <div>
            <h4>Gaps</h4>
            <FieldList items={scorecard.communityToAiAlignment.gaps} />
          </div>
          <div>
            <h4>Likely AI Influencing Narratives</h4>
            <FieldList items={scorecard.communityToAiAlignment.likelyAiInfluencingNarratives} />
          </div>
          <div>
            <h4>Recommended Actions</h4>
            <FieldList items={scorecard.communityToAiAlignment.recommendedActions} />
          </div>
        </div>
      </article>
    </section>
  );
}
