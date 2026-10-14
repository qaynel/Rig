# infrastructure.cicd.pipeline-definition — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for pipeline definition; it does not widen ownership beyond cicd.pipeline-definition. The context signals are required_checks. Binding checks: pipeline-definition-cicd-context.

Read the existing repository's pipeline definition convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cicd under their own verdicts.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:repository-context. Given cicd.pipeline-definition has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`.

Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Input: `rig-services/infrastructure.cicd.pipeline-definition.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Select an approved repository-owned command to verify that behavior.

minimal: stages — ["build","test","deploy"].

mid: required checks — ["test"].

maximal: deploy after failed checks — false.
