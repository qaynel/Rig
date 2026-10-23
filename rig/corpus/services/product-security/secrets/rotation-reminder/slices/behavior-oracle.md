# product-security.secrets.rotation-reminder — behavior-oracle slice

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade slice `rotation-reminder-slice-behavior-oracle`: List the credential classes covered, such as API keys and deploy tokens. Unlisted classes never rotate, so name them. Despite its name this slice is not a behavior oracle: it confirms credential classes, a rotation interval and the ownerless flag are declared; it does not show any credential was rotated.
