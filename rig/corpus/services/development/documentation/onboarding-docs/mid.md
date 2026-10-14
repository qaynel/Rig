# development.documentation.onboarding-docs — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for onboarding docs; it does not widen ownership beyond documentation.onboarding-docs. For onboarding docs, inspect these context signals: . Binding checks: onboarding-docs-documentation-context.

Anchor the review on the existing repository's onboarding docs convention, then name the source path or command that establishes it. For onboarding docs, inspect the repository's actual spec, source, test, or configuration for ; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring documentation services outside the onboarding docs decision for documentation.onboarding-docs.

Acceptance target: fixture:development.documentation.onboarding-docs:repository-context. Given documentation.onboarding-docs has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent documentation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Offer when a new contributor cannot locate installation and execution instructions.
minimal: setup command — ["npm","install"].
mid: run command — ["npm","start"].
maximal: check command — ["npm","test"].
