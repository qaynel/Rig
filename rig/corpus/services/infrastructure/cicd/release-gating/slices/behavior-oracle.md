# infrastructure.cicd.release-gating — behavior-oracle slice

Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.

Policy grade slice. This slice bounds release gating to cicd.release-gating. It uses `release-gating-slice-behavior-oracle` and checks required_gates (nonempty): required gates must name the concrete repository contract.