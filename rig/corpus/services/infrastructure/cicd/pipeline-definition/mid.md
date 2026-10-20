# infrastructure.cicd.pipeline-definition — mid

Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: pipeline-definition-source-code-boundary, pipeline-definition-cicd-context.

Read the existing repository's pipeline definition convention, then name the source path or command that establishes it. For pipeline definition, inspect the repository's actual spec, source, test, or configuration for required_checks; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cicd services outside the pipeline definition decision for cicd.pipeline-definition.

Acceptance target: policy:infrastructure.cicd.pipeline-definition:mid:pipeline-definition-source-code-boundary+pipeline-definition-cicd-context.

Declared predicates: pipeline-definition-source-code-boundary: `stages` is nonempty (a string or array); pipeline-definition-cicd-context: `required_checks` is nonempty (a string or array).
