# infrastructure.container.image-optimization — minimal

Minimal establishes a non-vacuous policy boundary for image optimization. It checks base_image_digest (nonempty): base image digest must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe container.image-optimization; bind it to the input named in `rig-services/infrastructure.container.image-optimization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside container.image-optimization is a failure.

Acceptance target: fixture:infrastructure.container.image-optimization:policy-boundary. Given source-code is present and container.image-optimization is selected, pass only when the repository binding evaluates container.image-optimization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. A passing policy check does not establish runtime behavior.
