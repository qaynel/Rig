# infrastructure.cicd.pipeline-definition — behavior-oracle slice

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade slice `pipeline-definition-slice-behavior-oracle`: List the pipeline stages in order. Implicit ordering lets deploy run before verification, so name build, verify and deploy explicitly. Despite its name this slice is not a behavior oracle: it confirms pipeline stages, required checks and the deploy-after-failure flag are declared; it does not show the pipeline blocks a failing build.
