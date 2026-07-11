# Provider and Worker Interfaces

`CommunityDataProvider` accepts a normalized score request and strict limits, and returns traceable evidence plus provider and demonstration status. `FixtureCommunityDataProvider` is deterministic and always marks results as demonstrations. `RedditOAuthCommunityDataProvider` refuses to run until approved access is implemented and enabled.

`FreeScoreJobQueue` separates enqueueing from processing. Supabase Queues is the production contract; the local implementation logs bounded messages for development. Browser clients never read queues directly.

`TransactionalEmailProvider` has disabled and Resend implementations. Email stays disabled unless `FREE_SCORE_EMAIL_ENABLED=true` and the sending domain is verified.

Analytics is exposed through a typed `track` function. It returns without network activity unless the public flag is true and the user has granted explicit consent. Autocapture and session replay are not used.
