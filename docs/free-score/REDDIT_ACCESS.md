# Reddit Production Access Setup

Production live scoring is disabled until Reddit explicitly approves the use case.

## Application and grant

Request a confidential server-side/web application suitable for a backend service. Proposed use case: “The Redditrepreneur provides bounded Community Intelligence reports for companies. It searches public Reddit conversations using approved API access, stores post IDs, source URLs and short necessary excerpts temporarily, classifies aggregate brand recommendation and trust signals, honours deletion/retention requirements, and does not reproduce Reddit content or profile individuals.”

Prefer OAuth client-credentials/application-only access if Reddit permits it for public search. If Reddit requires an account-linked script or refresh-token grant, obtain explicit approval for that grant and service account. Do not infer the grant from legacy documentation.

Requested scopes should be read-only and minimal, expected to include `read`; add `identity` only if Reddit requires it for the approved grant. No voting, posting, messaging or private-user scopes are needed.

Redirect URLs, only if an authorization-code flow is required:

- `https://app.theredditrepreneur.com/api/providers/reddit/callback`
- A separately registered nonproduction preview callback

Required environment variables: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`, and only when applicable `REDDIT_REFRESH_TOKEN`.

Respect response rate-limit headers and Reddit’s approved quota. Use a descriptive User-Agent, central token caching, query-result caching, no more than configured searches/posts/comments, bounded retries with jitter, and provider-wide backoff on 429. Cache source metadata for no longer than 30 days and never use public JSON/RSS as production fallback.

Commercial approval, data licensing, model-training restrictions, content deletion obligations and permitted storage must be confirmed with Reddit before `FREE_SCORE_LIVE_DATA_ENABLED=true`.
