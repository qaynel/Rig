# infrastructure.cicd.release-gating — behavior-oracle slice

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Policy grade slice `release-gating-slice-behavior-oracle`: List the gates a release must pass. With none declared any build can ship, so name each required gate. Despite its name this slice is not a behavior oracle: it confirms required gates, the release revision and the stale-result flag are declared; it does not show the gates passed for that artifact.
