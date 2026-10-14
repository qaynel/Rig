# product-security.secrets.rotation-reminder — floor and mutation-floor slice

Policy grade slice. This slice bounds rotation reminder to secrets.rotation-reminder. It uses `rotation-reminder-slice-floor` and checks credential_classes (nonempty): credential classes must name the concrete repository contract..

Inspect a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.rotation-reminder.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Owned scope: `secrets.rotation-reminder`.

Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Input: `rig-services/product-security.secrets.rotation-reminder.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior.

minimal: credential classes — ["service token"].

mid: rotation interval days — 90.

maximal: rotation without owner — false.
