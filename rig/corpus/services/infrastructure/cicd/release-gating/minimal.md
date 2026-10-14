# infrastructure.cicd.release-gating — minimal

Minimal establishes a non-vacuous policy boundary for release gating. It checks required_gates (nonempty): required gates must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe cicd.release-gating; bind it to the input named in `rig-services/infrastructure.cicd.release-gating.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cicd.release-gating is a failure.

Acceptance target: fixture:infrastructure.cicd.release-gating:policy-boundary. Given source-code is present and cicd.release-gating is selected, pass only when the repository binding evaluates cicd.release-gating and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. A passing policy check does not establish runtime behavior.
