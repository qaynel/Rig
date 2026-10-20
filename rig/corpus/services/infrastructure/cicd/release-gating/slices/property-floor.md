# infrastructure.cicd.release-gating — property-floor slice

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Policy grade slice `release-gating-slice-property-floor`: List the gates a release must pass. With none declared any build can ship, so name each required gate.
