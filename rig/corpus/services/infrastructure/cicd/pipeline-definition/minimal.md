# infrastructure.cicd.pipeline-definition — minimal

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade, minimal: List the pipeline stages in order. Implicit ordering lets deploy run before verification, so name build, verify and deploy explicitly. Binding checks: pipeline-definition-source-code-boundary.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:minimal:pipeline-definition-source-code-boundary.
Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array).
