# rotation reminder

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Owned scope: `secrets.rotation-reminder`.

Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Input: `rig-services/product-security.secrets.rotation-reminder.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Select an approved repository-owned command to verify that behavior.

minimal: credential classes — ["service token"].

mid: rotation interval days — 90.

maximal: rotation without owner — false.

