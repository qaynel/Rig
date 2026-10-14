# infrastructure.cicd.pipeline-definition — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for pipeline definition. It checks stages (nonempty): stages must name the concrete repository contract.. Binding checks: pipeline-definition-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe cicd.pipeline-definition; bind it to the input named in `rig-services/infrastructure.cicd.pipeline-definition.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cicd.pipeline-definition is a failure.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:policy-boundary. Given source-code is present and cicd.pipeline-definition is selected, pass only when the repository binding evaluates cicd.pipeline-definition and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`.

Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

minimal: stages — ["build","test","deploy"].

mid: required checks — ["test"].

maximal: deploy after failed checks — false.
