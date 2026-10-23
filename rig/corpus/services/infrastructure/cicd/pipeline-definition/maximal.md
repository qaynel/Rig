# infrastructure.cicd.pipeline-definition — maximal

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade, maximal: Set deploying after failed checks to false. A red stage that does not block deployment only records the failure, so make deploy depend on the checks. Cumulative with minimal and mid. Binding checks: pipeline-definition-source-code-boundary, pipeline-definition-cicd-context, pipeline-definition-evidence-receipt.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:maximal:pipeline-definition-source-code-boundary+pipeline-definition-cicd-context+pipeline-definition-evidence-receipt.
Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array); pipeline-definition-cicd-context: `required_checks` is nonempty (a string or array); pipeline-definition-evidence-receipt: `deploy_after_failed_checks` equals false.
