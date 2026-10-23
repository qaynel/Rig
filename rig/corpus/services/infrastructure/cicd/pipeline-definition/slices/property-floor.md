# infrastructure.cicd.pipeline-definition — property-floor slice

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade slice `pipeline-definition-slice-property-floor`: List the pipeline stages in order. Implicit ordering lets deploy run before verification, so name build, verify and deploy explicitly.
