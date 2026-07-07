import type { CommunityIntelligenceAssessment } from '@/lib/ai/community-intelligence';
import type { ReactNode } from 'react';

type CommunityAssessmentProps = {
  assessment?: CommunityIntelligenceAssessment;
  fallbackScore?: number;
  fallbackConfidence?: number;
  sourceCoverage?: {
    searchedSources: string[];
    limitation: string;
  };
  retrievedCount?: number;
};

type BadgeTone = 'high' | 'medium' | 'low' | 'neutral';

function clampScore(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toneFrom(value?: string): BadgeTone {
  const normalized = value?.toLowerCase();
  if (normalized === 'high') return 'high';
  if (normalized === 'medium') return 'medium';
  if (normalized === 'low') return 'low';
  return 'neutral';
}

function AssessmentBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`assessment-badge ${tone}`}>{children}</span>;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const score = clampScore(value);

  return (
    <div className="assessment-scorebar">
      <div>
        <span>{label}</span>
        <strong>{score}/100</strong>
      </div>
      <i><span style={{ width: `${score}%` }} /></i>
    </div>
  );
}

function TextList({ items }: { items?: string[] }) {
  const safeItems = items?.filter(Boolean) || [];

  if (!safeItems.length) {
    return <p>No strong signal identified yet.</p>;
  }

  return (
    <ul>
      {safeItems.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function CommunityAssessment({
  assessment,
  fallbackScore,
  fallbackConfidence,
  sourceCoverage,
  retrievedCount,
}: CommunityAssessmentProps) {
  if (!assessment) return null;

  const health = assessment.communityHealthScore;
  const confidence = assessment.confidenceScoreExplained;
  const decision = assessment.executiveDecision;
  const summary = assessment.executiveSummaryCard;
  const finalConclusion = assessment.finalExecutiveConclusion;
  const confidenceScore = clampScore(confidence?.score || fallbackConfidence);
  const overallScore = clampScore(health?.overallScore || fallbackScore);
  const sourcesSearched = confidence?.sourcesSearched || sourceCoverage?.searchedSources.length || 0;
  const conversationsFound = confidence?.relevantConversationsFound ?? retrievedCount ?? 0;

  return (
    <section className="assessment-section">
      <header className="assessment-hero">
        <div>
          <div className="eyebrow">Community Intelligence Assessment</div>
          <h2>Community Intelligence Assessment</h2>
          <p>Generated using The Redditrepreneur Framework</p>
        </div>
        <div className="assessment-framework" aria-label="The Redditrepreneur Framework">
          {['Understand', 'Discover', 'Prioritise', 'Recommend', 'Act'].map((stage) => (
            <span key={stage}>{stage}</span>
          ))}
        </div>
      </header>

      <article className="assessment-card assessment-decision">
        <div className="assessment-card-head">
          <span className="dashboard-kicker">Executive Decision Box</span>
          <AssessmentBadge tone={toneFrom(decision.priority)}>{decision.priority} Priority</AssessmentBadge>
        </div>
        <h3>{decision.recommendedDecision}</h3>
        <div className="assessment-detail-grid">
          <div><strong>Why this matters</strong><p>{decision.whyThisMatters}</p></div>
          <div><strong>Expected impact</strong><p>{decision.expectedImpact}</p></div>
          <div><strong>Confidence</strong><p>{clampScore(decision.confidence)}%</p></div>
        </div>
      </article>

      <article className="assessment-card">
        <span className="dashboard-kicker">Executive Summary</span>
        <div className="assessment-summary-grid">
          <div><strong>Key finding</strong><p>{summary.keyFinding}</p></div>
          <div><strong>Biggest opportunity</strong><p>{summary.biggestOpportunity}</p></div>
          <div><strong>Biggest risk</strong><p>{summary.biggestRisk}</p></div>
          <div><strong>Immediate action</strong><p>{summary.immediateAction}</p></div>
          <div><strong>One week recommendation</strong><p>{summary.oneWeekRecommendation}</p></div>
          <div><strong>One month recommendation</strong><p>{summary.oneMonthRecommendation}</p></div>
        </div>
      </article>

      <div className="assessment-grid two">
        <article className="assessment-card">
          <div className="assessment-card-head">
            <span className="dashboard-kicker">Community Health Score</span>
            <strong className="assessment-score">{overallScore}/100</strong>
          </div>
          <div className="health-score-grid">
            <ScoreBar label="Conversation volume" value={health.conversationVolume} />
            <ScoreBar label="Brand awareness" value={health.brandAwareness} />
            <ScoreBar label="Commercial intent" value={health.commercialIntent} />
            <ScoreBar label="Community trust" value={health.communityTrust} />
            <ScoreBar label="Momentum" value={health.momentum} />
          </div>
        </article>

        <article className="assessment-card confidence-explainer">
          <div className="assessment-card-head">
            <span className="dashboard-kicker">Confidence Score Explained</span>
            <strong className="assessment-score">{confidenceScore}/100</strong>
          </div>
          <div className="assessment-detail-grid compact">
            <div><strong>Sources searched</strong><p>{sourcesSearched}</p></div>
            <div><strong>Relevant conversations</strong><p>{conversationsFound}</p></div>
            <div><strong>Brand mentions</strong><p>{confidence.brandMentionsFound ? 'Found' : 'Not strongly identified'}</p></div>
          </div>
          <p>{confidence.coverageLimitations || sourceCoverage?.limitation}</p>
          <p>{confidence.evidenceBasis}</p>
        </article>
      </div>

      <article className="assessment-card source-quality-card">
        <span className="dashboard-kicker">Source Quality</span>
        <p>{assessment.sourceQualityMessage}</p>
      </article>

      <div className="assessment-grid">
        {assessment.evidenceInsightRecommendations.map((item) => (
          <article className="assessment-card eir-card" key={item.title}>
            <h3>{item.title}</h3>
            <div><strong>Evidence</strong><p>{item.evidence}</p></div>
            <div><strong>Insight</strong><p>{item.insight}</p></div>
            <div><strong>Recommendation</strong><p>{item.recommendation}</p></div>
          </article>
        ))}
      </div>

      <article className="assessment-card">
        <span className="dashboard-kicker">Top Opportunities</span>
        <div className="opportunity-ranking-grid">
          {assessment.opportunityRanking.slice(0, 3).map((opportunity) => (
            <div key={opportunity.opportunityTitle}>
              <h3>{opportunity.opportunityTitle}</h3>
              <p>{opportunity.businessImpact}</p>
              <div className="assessment-chip-row">
                <AssessmentBadge tone={toneFrom(opportunity.urgency)}>Urgency {opportunity.urgency}</AssessmentBadge>
                <AssessmentBadge tone={toneFrom(opportunity.difficulty)}>Difficulty {opportunity.difficulty}</AssessmentBadge>
                <AssessmentBadge>Confidence {clampScore(opportunity.confidence)}%</AssessmentBadge>
              </div>
              <strong>Owner: {opportunity.suggestedOwner}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="assessment-card">
        <span className="dashboard-kicker">Priority Matrix</span>
        <div className="priority-matrix-grid">
          <div><h3>Quick Wins</h3><TextList items={assessment.priorityMatrix.quickWins} /></div>
          <div><h3>Strategic Projects</h3><TextList items={assessment.priorityMatrix.strategicProjects} /></div>
          <div><h3>Monitor</h3><TextList items={assessment.priorityMatrix.monitor} /></div>
          <div><h3>Deprioritise</h3><TextList items={assessment.priorityMatrix.deprioritise} /></div>
        </div>
      </article>

      <div className="assessment-grid two">
        <article className="assessment-card buying-intent-card">
          <div className="assessment-card-head">
            <span className="dashboard-kicker">Buying Intent</span>
            <AssessmentBadge tone={toneFrom(assessment.buyingIntent.level)}>{assessment.buyingIntent.level}</AssessmentBadge>
          </div>
          <div><strong>Evidence</strong><p>{assessment.buyingIntent.evidence}</p></div>
          <div><strong>Commercial meaning</strong><p>{assessment.buyingIntent.commercialMeaning}</p></div>
          <div><strong>Recommended action</strong><p>{assessment.buyingIntent.recommendedAction}</p></div>
        </article>

        <article className="assessment-card">
          <span className="dashboard-kicker">Content Roadmap</span>
          <div className="roadmap-grid">
            <div><h3>This week</h3><TextList items={assessment.contentRoadmap.thisWeek} /></div>
            <div><h3>This month</h3><TextList items={assessment.contentRoadmap.thisMonth} /></div>
            <div><h3>Long term</h3><TextList items={assessment.contentRoadmap.longTerm} /></div>
          </div>
        </article>
      </div>

      <article className="assessment-card">
        <span className="dashboard-kicker">Competitor Intelligence</span>
        {assessment.competitorIntelligence.length ? (
          <div className="competitor-intel-grid">
            {assessment.competitorIntelligence.map((competitor) => (
              <div key={competitor.competitor}>
                <h3>{competitor.competitor}</h3>
                <p><strong>Strength:</strong> {competitor.strength}</p>
                <p><strong>Weakness:</strong> {competitor.weakness}</p>
                <p><strong>Perception:</strong> {competitor.communityPerception}</p>
                <p><strong>Opportunity:</strong> {competitor.opportunity}</p>
                <AssessmentBadge>Confidence {clampScore(competitor.confidence)}%</AssessmentBadge>
              </div>
            ))}
          </div>
        ) : (
          <p>No strong competitor evidence was identified in this assessment.</p>
        )}
      </article>

      <article className="assessment-card">
        <span className="dashboard-kicker">AI Search Opportunities</span>
        <div className="ai-search-opportunity-grid">
          {assessment.aiSearchOpportunities.map((opportunity) => (
            <div key={opportunity.questionsPeopleAreAsking}>
              <h3>{opportunity.questionsPeopleAreAsking}</h3>
              <p><strong>Topic to own:</strong> {opportunity.topicsWorthOwning}</p>
              <p><strong>Recommended content:</strong> {opportunity.recommendedContent}</p>
              <p>{opportunity.whyThisHelpsAiVisibility}</p>
              <AssessmentBadge>Priority {clampScore(opportunity.priorityScore)}/100</AssessmentBadge>
            </div>
          ))}
        </div>
      </article>

      <article className="assessment-card">
        <span className="dashboard-kicker">Priority Actions</span>
        <div className="priority-actions-grid">
          {assessment.priorityActions.map((action) => (
            <div key={action.whatToDo}>
              <h3>{action.whatToDo}</h3>
              <p><strong>Why:</strong> {action.why}</p>
              <p><strong>Expected impact:</strong> {action.expectedImpact}</p>
              <div className="assessment-chip-row">
                <AssessmentBadge tone={toneFrom(action.estimatedEffort)}>Effort {action.estimatedEffort}</AssessmentBadge>
                <AssessmentBadge>Owner {action.owner}</AssessmentBadge>
                <AssessmentBadge>Confidence {clampScore(action.confidence)}%</AssessmentBadge>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="assessment-card methodology-footer">
        <span className="dashboard-kicker">The Redditrepreneur Framework</span>
        <div className="methodology-grid">
          <div><strong>Understand</strong><p>Identify what communities are saying.</p></div>
          <div><strong>Discover</strong><p>Find patterns and opportunities.</p></div>
          <div><strong>Prioritise</strong><p>Separate signal from noise.</p></div>
          <div><strong>Recommend</strong><p>Turn insight into business action.</p></div>
          <div><strong>Act</strong><p>Help the team execute.</p></div>
        </div>
      </article>

      <article className="assessment-card final-conclusion-card">
        <span className="dashboard-kicker">Final Executive Conclusion</span>
        <h3>{finalConclusion.overallAssessment}</h3>
        <div className="assessment-summary-grid">
          <div><strong>Biggest opportunity</strong><p>{finalConclusion.biggestOpportunity}</p></div>
          <div><strong>Biggest risk</strong><p>{finalConclusion.biggestRisk}</p></div>
          <div><strong>Immediate next step</strong><p>{finalConclusion.immediateNextStep}</p></div>
          <div><strong>Overall confidence</strong><p>{clampScore(finalConclusion.overallConfidence)}%</p></div>
        </div>
      </article>
    </section>
  );
}
