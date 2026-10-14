# infrastructure.cost.rightsizing — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rightsizing. The minimal boundary for rightsizing checks candidate_resources (nonempty): candidate resources must name the concrete repository contract.. Binding checks: rightsizing-source-code-boundary.

Start from a repository-owned command or existing native check that can observe cost.rightsizing; bind it to the input named in `rig-services/infrastructure.cost.rightsizing.json` and preserve the check's failure status. When adopting this in an existing repository, connect rightsizing to the command that inspects candidate_resources and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cost.rightsizing as a failure.

Acceptance target: fixture:infrastructure.cost.rightsizing:policy-boundary. Given source-code is present and cost.rightsizing is selected, pass only when the repository binding evaluates cost.rightsizing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. The ceiling is rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Choose a repository-owned check that observes rightsizing from rig-services/infrastructure.cost.rightsizing.json..

Service-specific evidence cues:
Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.
minimal: candidate resources — ["worker pool"].
mid: minimum headroom percent — 20.
maximal: resize without workload evidence — false.
