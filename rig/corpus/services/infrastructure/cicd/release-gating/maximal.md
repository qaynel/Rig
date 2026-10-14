# infrastructure.cicd.release-gating — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for release gating. The evidence must preserve the required_gates, release_revision, use_stale_gate_results inputs that determined the result. Binding checks: release-gating-evidence-receipt.

Inspect a second run against unchanged release gating inputs. Record the required_gates, release_revision, use_stale_gate_results inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this release gating result is stale. The ceiling remains: release gating configuration validation only; declared policy does not prove running release gating behavior. Choose a repository-owned check that observes release gating from rig-services/infrastructure.cicd.release-gating.json.

Acceptance target: fixture:infrastructure.cicd.release-gating:evidence-replay. Given the cicd.release-gating binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.
minimal: required gates — ["tests","artifact digest"].
mid: release revision — "a1b2c3d".
maximal: use stale gate results — false.
