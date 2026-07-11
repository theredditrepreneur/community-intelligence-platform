# Community Intelligence Score Methodology

Version: `community-score-v1`

The score is calculated by application code, never selected by an AI model. AI may classify bounded evidence into validated signals. Five dimensions contribute 0–20 points each and the overall score is their exact sum.

## Evidence rules

- Minimum overall evidence: five relevant conversations; otherwise the result is `Limited Community Data` and has no numerical overall score.
- Share of Consensus requires at least five qualifying recommendation conversations.
- A conversation qualifies only when its context contains a genuine category recommendation. A mention alone does not qualify.
- Duplicate provider IDs and canonical URLs are removed. Near-duplicate excerpts receive a shared fingerprint and count once.
- Evidence outside the configured 90-day window is excluded. Recency decays linearly across the window.
- Positive and negative trust evidence are both retained. Negative evidence lowers trust; absence of evidence is not positive evidence.
- Responsiveness scores only visible response-to-feedback signals. Missing evidence produces low or insufficient confidence.

## Dimensions

1. Community Presence: relevant volume 40%, recency 25%, community breadth 20%, organic mention rate 15%.
2. Community Trust: recommendation strength 40%, positive/negative trust balance 35%, consistency 25%.
3. Share of Consensus: qualifying recommendation share 70%, sample strength 30%. Denominator is all qualifying recommendations for the target, named competitors and other named brands.
4. Insight Responsiveness: visible response evidence 70%, breadth 30%.
5. Community Authority: authority evidence 50%, repeated recommendations 30%, breadth 20%.

All intermediate calculations are clamped to 0–20. Confidence depends on relevant evidence count and community breadth: insufficient below two items; low below five or fewer than two communities; moderate below twelve or fewer than three communities; high otherwise.

Every report distinguishes observed evidence, AI interpretation, inference and insufficient evidence. Stored reports retain methodology and classification versions and are never silently recalculated.
