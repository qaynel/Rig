# product-security.secrets.rotation-reminder — identity

Policy grade: rotation reminder owns secrets.rotation-reminder. Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Keep sibling services in secrets under their own verdicts. Tie acceptance to the configured input at `rig-services/product-security.secrets.rotation-reminder.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.rotation-reminder:policy-boundary. Given source-code is present and secrets.rotation-reminder is selected, pass only when the repository binding evaluates secrets.rotation-reminder and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.

Service-specific evidence cues:
Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Owned scope: `secrets.rotation-reminder`.

Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Input: `rig-services/product-security.secrets.rotation-reminder.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior.

minimal: credential classes — ["service token"].

mid: rotation interval days — 90.

maximal: rotation without owner — false.
