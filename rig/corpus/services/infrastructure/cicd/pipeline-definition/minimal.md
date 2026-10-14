# infrastructure.cicd.pipeline-definition — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for pipeline definition. The minimal boundary for pipeline definition checks stages (nonempty): stages must name the concrete repository contract.. Binding checks: pipeline-definition-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe cicd.pipeline-definition; bind it to the input named in `rig-services/infrastructure.cicd.pipeline-definition.json` and preserve the check's failure status. When adopting this in an existing repository, connect pipeline definition to the command that inspects stages and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cicd.pipeline-definition as a failure.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:policy-boundary. Given source-code is present and cicd.pipeline-definition is selected, pass only when the repository binding evaluates cicd.pipeline-definition and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. The ceiling is pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Choose a repository-owned check that observes pipeline definition from rig-services/infrastructure.cicd.pipeline-definition.json..

Service-specific evidence cues:
Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.
minimal: stages — ["build","test","deploy"].
mid: required checks — ["test"].
maximal: deploy after failed checks — false.
