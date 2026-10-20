# infrastructure.cicd.pipeline-definition — floor and mutation-floor slice

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade slice. This slice bounds pipeline definition to cicd.pipeline-definition. It uses `pipeline-definition-slice-floor` and checks stages (nonempty): stages must name the concrete repository contract.