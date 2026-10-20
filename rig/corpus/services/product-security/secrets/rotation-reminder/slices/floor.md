# product-security.secrets.rotation-reminder — floor and mutation-floor slice

Assign credential classes a rotation interval and an accountable owner. A reminder is a scheduling control and does not demonstrate that a credential was rotated.

Policy grade slice. This slice bounds rotation reminder to secrets.rotation-reminder. It uses `rotation-reminder-slice-floor` and checks credential_classes (nonempty): credential classes must name the concrete repository contract.