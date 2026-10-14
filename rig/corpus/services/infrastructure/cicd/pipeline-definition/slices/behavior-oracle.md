# infrastructure.cicd.pipeline-definition — behavior-oracle slice

Policy grade slice. This slice bounds pipeline definition to cicd.pipeline-definition. It uses `pipeline-definition-slice-behavior-oracle` and checks stages (nonempty): stages must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cicd.pipeline-definition.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`.

Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

minimal: stages — ["build","test","deploy"].

mid: required checks — ["test"].

maximal: deploy after failed checks — false.
