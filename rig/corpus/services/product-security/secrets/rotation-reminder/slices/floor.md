# product-security.secrets.rotation-reminder — floor and mutation-floor slice

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade slice `rotation-reminder-slice-floor`: List the credential classes covered, such as API keys and deploy tokens. Unlisted classes never rotate, so name them.
