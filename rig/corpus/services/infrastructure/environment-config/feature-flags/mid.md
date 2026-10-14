# infrastructure.environment-config.feature-flags — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for feature flags; it does not widen ownership beyond environment-config.feature-flags. For feature flags, inspect these context signals: rollback_owner. Binding checks: feature-flags-environment-config-context.

Inspect the existing repository's feature flags convention, then name the source path or command that establishes it. For feature flags, inspect the repository's actual spec, source, test, or configuration for rollback_owner; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the feature flags decision for environment-config.feature-flags.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:repository-context. Given environment-config.feature-flags has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.
minimal: flag names — ["new_checkout"].
mid: rollback owner — "checkout team".
maximal: permanent unowned flags — false.
