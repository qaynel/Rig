# infrastructure.provisioning.environment-parity — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for environment parity; it does not widen ownership beyond provisioning.environment-parity. For environment parity, inspect these context signals: intentional_differences. Binding checks: environment-parity-provisioning-context.

Anchor the review on the existing repository's environment parity convention, then name the source path or command that establishes it. For environment parity, inspect the repository's actual spec, source, test, or configuration for intentional_differences; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring provisioning services outside the environment parity decision for provisioning.environment-parity.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:repository-context. Given provisioning.environment-parity has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.
minimal: environments — ["staging","production"].
mid: intentional differences — ["instance count"].
maximal: unrecorded differences allowed — false.
