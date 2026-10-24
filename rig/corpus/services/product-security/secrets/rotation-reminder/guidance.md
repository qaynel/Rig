# rotation-reminder

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Owned scope: `secrets.rotation-reminder`. Input: `rig-services/product-security.secrets.rotation-reminder.json`.

Coverage ceiling: Configuration validation only, so it confirms credential classes, a rotation interval and the ownerless flag are declared; it does not show any credential was rotated.

minimal: credential classes — ["service token"]. List the credential classes covered, such as API keys and deploy tokens. Unlisted classes never rotate, so name them.

mid: rotation interval days — 90. Set a rotation interval in days, at least 90 declared. An unscheduled credential lives forever, so set the interval.

maximal: rotation without owner — false. Set rotation without an owner to false. A reminder nobody owns is ignored, so assign a responsible person or team.
