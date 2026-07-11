# Turnstile Setup Guide

Create a Cloudflare Turnstile widget and allow `app.theredditrepreneur.com`, `theredditrepreneur.com` and `www.theredditrepreneur.com`. Do not add arbitrary preview hosts to the production widget. Configure the site key and server-only secret outside source control. Test server-side verification, expired/duplicate tokens and generic failures. Turnstile works without proxying the app through Cloudflare. Enable both the public flag and secret only after the widget is configured; HMAC rate limits remain active either way.
