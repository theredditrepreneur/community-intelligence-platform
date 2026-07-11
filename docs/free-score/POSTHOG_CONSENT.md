# PostHog Consent Implementation

PostHog uses the EU host and remains disabled by default. No request is sent before stored explicit consent. Users can withdraw consent, after which event capture stops. The implementation uses manual typed events, disables person profiles, and does not use autocapture, session replay, email, company name, excerpts, report content or sensitive URLs.

Before enabling, approve cookie-banner language, privacy wording, retention, lawful basis, consent records and withdrawal UX. Configure the public key and EU host, test events in a nonproduction project, and set `NEXT_PUBLIC_POSTHOG_ENABLED=true` only after approval.
