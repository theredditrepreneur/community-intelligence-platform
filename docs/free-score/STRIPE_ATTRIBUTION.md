# Stripe Audit Attribution Findings

Version one records an owner-scoped pending conversion before redirecting to the existing Payment Link. In `click_only` mode the click is recorded but completion remains unattributed. If the existing Payment Link accepts and returns `client_reference_id`, change the flag to `client_reference_id`; the redirect appends an opaque `fsca_` reference and the signed `checkout.session.completed` webhook reconciles it.

No conversion is confirmed from a click or browser return. Test the existing link in Stripe test mode or with Stripe-supported diagnostics before changing mode. Do not alter the Payment Link without approval. A dedicated Checkout Session is the later fallback for reliable metadata.
