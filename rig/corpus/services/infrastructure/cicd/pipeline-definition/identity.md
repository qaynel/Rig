# infrastructure.cicd.pipeline-definition — identity

Policy grade: pipeline-definition owns cicd.pipeline-definition. Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Configuration validation only, so it confirms pipeline stages, required checks and the deploy-after-failure flag are declared; it does not show the pipeline blocks a failing build.

Disposition: executable.
Acceptance target: policy:infrastructure.cicd.pipeline-definition:minimal:pipeline-definition-source-code-boundary.
Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array).
