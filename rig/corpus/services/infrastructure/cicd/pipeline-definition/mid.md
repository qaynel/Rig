# infrastructure.cicd.pipeline-definition — mid

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Policy grade, mid: List the checks a deploy requires. A pipeline that does not name required checks can ship unverified code, so declare them. Cumulative with minimal. Binding checks: pipeline-definition-source-code-boundary, pipeline-definition-cicd-context.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:mid:pipeline-definition-source-code-boundary+pipeline-definition-cicd-context.
Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array); pipeline-definition-cicd-context: `required_checks` is nonempty (a string or array).
