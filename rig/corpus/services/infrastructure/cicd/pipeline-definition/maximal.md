# infrastructure.cicd.pipeline-definition — maximal

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: pipeline-definition-source-code-boundary, pipeline-definition-cicd-context, pipeline-definition-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:maximal:pipeline-definition-source-code-boundary+pipeline-definition-cicd-context+pipeline-definition-evidence-receipt.

Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array); pipeline-definition-cicd-context: `required_checks` is nonempty (a string or array); pipeline-definition-evidence-receipt: `deploy_after_failed_checks` equals false.
