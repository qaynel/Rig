# testing.integration.cross-module — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for cross module; it does not widen ownership beyond integration.cross-module. For cross module, inspect these context signals: interaction_cases. Binding checks: cross-module-integration-context.

Ground the decision in the existing repository's cross module convention, then name the source path or command that establishes it. For cross module, inspect the repository's actual spec, source, test, or configuration for interaction_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the cross module decision for integration.cross-module.

Acceptance target: fixture:testing.integration.cross-module:repository-context. Given integration.cross-module has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.
minimal: participating modules — ["orders","inventory"].
mid: interaction cases — ["order reserves stock"].
maximal: stub internal contracts — false.
