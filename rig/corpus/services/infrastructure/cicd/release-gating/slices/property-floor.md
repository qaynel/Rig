# infrastructure.cicd.release-gating — property-floor slice

Policy grade slice. This slice bounds release gating to cicd.release-gating. It uses `release-gating-slice-property-floor` and checks required_gates (nonempty): required gates must name the concrete repository contract..

For release gating, choose a repository example that satisfies required_gates at the property-floor floor, plus a failure where required gates must name the concrete repository contract. is false. For release gating, wire `property-floor` to `rig-services/infrastructure.cicd.release-gating.json` and keep its verdict on required_gates; missing evidence is a named gap, with ceiling release gating configuration validation only; declared policy does not prove running release gating behavior. Choose a repository-owned check that observes release gating from rig-services/infrastructure.cicd.release-gating.json..

Service-specific evidence cues:
Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.
minimal: required gates — ["tests","artifact digest"].
mid: release revision — "a1b2c3d".
maximal: use stale gate results — false.
