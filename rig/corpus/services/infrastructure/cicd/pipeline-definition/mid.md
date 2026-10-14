# infrastructure.cicd.pipeline-definition — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for pipeline definition; it does not widen ownership beyond cicd.pipeline-definition. For pipeline definition, inspect these context signals: required_checks. Binding checks: pipeline-definition-cicd-context.

Read the existing repository's pipeline definition convention, then name the source path or command that establishes it. For pipeline definition, inspect the repository's actual spec, source, test, or configuration for required_checks; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cicd services outside the pipeline definition decision for cicd.pipeline-definition.

Acceptance target: fixture:infrastructure.cicd.pipeline-definition:repository-context. Given cicd.pipeline-definition has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cicd concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.
minimal: stages — ["build","test","deploy"].
mid: required checks — ["test"].
maximal: deploy after failed checks — false.
