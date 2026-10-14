# infrastructure.cicd.release-gating — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for release gating. The minimal boundary for release gating checks required_gates (nonempty): required gates must name the concrete repository contract.. Binding checks: release-gating-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe cicd.release-gating; bind it to the input named in `rig-services/infrastructure.cicd.release-gating.json` and preserve the check's failure status. When adopting this in an existing repository, connect release gating to the command that inspects required_gates and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cicd.release-gating as a failure.

Acceptance target: fixture:infrastructure.cicd.release-gating:policy-boundary. Given source-code is present and cicd.release-gating is selected, pass only when the repository binding evaluates cicd.release-gating and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. The ceiling is release gating configuration validation only; declared policy does not prove running release gating behavior. Choose a repository-owned check that observes release gating from rig-services/infrastructure.cicd.release-gating.json..

Service-specific evidence cues:
Offer: Bind release gates to the revision and artifact that will ship. Earlier green results do not authorize a different commit or rebuilt artifact.
minimal: required gates — ["tests","artifact digest"].
mid: release revision — "a1b2c3d".
maximal: use stale gate results — false.
