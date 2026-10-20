# infrastructure.cicd.pipeline-definition — identity

Policy grade: pipeline definition owns cicd.pipeline-definition. Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Keep neighboring cicd services outside the pipeline definition decision for cicd.pipeline-definition. Anchor the review on the configured input at `rig-services/infrastructure.cicd.pipeline-definition.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Choose a repository-owned check that observes pipeline definition from rig-services/infrastructure.cicd.pipeline-definition.json.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:minimal:pipeline-definition-source-code-boundary.

Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array).
