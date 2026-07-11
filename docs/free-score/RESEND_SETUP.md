# Resend Verification Guide

1. Add `theredditrepreneur.com` in the existing approved Resend team.
2. Copy the exact SPF and DKIM records shown by Resend into DNS; values are account-specific and must not be invented.
3. Add a recommended DMARC TXT policy after reviewing existing mail providers, initially monitoring with `p=none` and an approved reporting mailbox.
4. Wait until Resend shows the domain as verified.
5. Create a restricted sending API key and configure `RESEND_API_KEY` outside source control.
6. Send a transactional test to an internal address from `The Redditrepreneur <no-reply@theredditrepreneur.com>` with reply-to `theredditrepreneur@gmail.com`.
7. Confirm SPF, DKIM, DMARC alignment, links and unsubscribe expectations. This message is transactional and does not add contacts to a newsletter.
8. Only then set `FREE_SCORE_EMAIL_ENABLED=true` in the approved environment.
