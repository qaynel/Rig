# pipeline-definition

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Owned scope: `cicd.pipeline-definition`. Input: `rig-services/infrastructure.cicd.pipeline-definition.json`.

Coverage ceiling: Configuration validation only, so it confirms pipeline stages, required checks and the deploy-after-failure flag are declared; it does not show the pipeline blocks a failing build.

minimal: stages — ["build","test","deploy"]. List the pipeline stages in order. Implicit ordering lets deploy run before verification, so name build, verify and deploy explicitly.

mid: required checks — ["test"]. List the checks a deploy requires. A pipeline that does not name required checks can ship unverified code, so declare them.

maximal: deploy after failed checks — false. Set deploying after failed checks to false. A red stage that does not block deployment only records the failure, so make deploy depend on the checks.
