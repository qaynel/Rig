# infrastructure.cicd.pipeline-definition — minimal

Minimal establishes a non-vacuous policy boundary for pipeline definition. It checks stages (nonempty): stages must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe cicd.pipeline-definition; bind it to the input named in `rig-services/infrastructure.cicd.pipeline-definition.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cicd.pipeline-definition is a failure.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:policy-boundary. Given source-code is present and cicd.pipeline-definition is selected, pass only when the repository binding evaluates cicd.pipeline-definition and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. A passing policy check does not establish runtime behavior.
