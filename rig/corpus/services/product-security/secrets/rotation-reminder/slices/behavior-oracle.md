# product-security.secrets.rotation-reminder — behavior-oracle slice

Policy grade slice. This slice bounds rotation reminder to secrets.rotation-reminder. It uses `rotation-reminder-slice-behavior-oracle` and checks credential_classes (nonempty): credential classes must name the concrete repository contract..

For rotation reminder, choose a repository example that satisfies credential_classes at the behavior-oracle floor, plus a failure where credential classes must name the concrete repository contract. is false. For rotation reminder, wire `behavior-oracle` to `rig-services/product-security.secrets.rotation-reminder.json` and keep its verdict on credential_classes; missing evidence is a named gap, with ceiling rotation reminder configuration validation only; declared policy does not prove running rotation reminder behavior. Choose a repository-owned check that observes rotation reminder from rig-services/product-security.secrets.rotation-reminder.json..

Service-specific evidence cues:
Offer: Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.
minimal: credential classes — ["service token"].
mid: rotation interval days — 90.
maximal: rotation without owner — false.
