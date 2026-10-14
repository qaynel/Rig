# infrastructure.cicd.pipeline-definition — identity

Policy grade: pipeline definition owns cicd.pipeline-definition. Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Keep sibling services in cicd under their own verdicts. Anchor the review on the configured input at `rig-services/infrastructure.cicd.pipeline-definition.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:policy-boundary. Given source-code is present and cicd.pipeline-definition is selected, pass only when the repository binding evaluates cicd.pipeline-definition and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern.

Service-specific evidence cues:
Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`.

Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

minimal: stages — ["build","test","deploy"].

mid: required checks — ["test"].

maximal: deploy after failed checks — false.
