# infrastructure.cicd.pipeline-definition — minimal

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for pipeline definition. The minimal boundary for pipeline definition checks stages (nonempty): stages must name the concrete repository contract. Binding checks: pipeline-definition-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe cicd.pipeline-definition; bind it to the input named in `rig-services/infrastructure.cicd.pipeline-definition.json` and preserve the check's failure status. When adopting this in an existing repository, connect pipeline definition to the command that inspects stages and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cicd.pipeline-definition as a failure.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:minimal:pipeline-definition-source-code-boundary.

Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array).
