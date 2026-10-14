# infrastructure.environment-config.config-drift — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for config drift; it does not widen ownership beyond environment-config.config-drift. For config drift, inspect these context signals: comparison_schedule. Binding checks: config-drift-environment-config-context.

Inspect the existing repository's config drift convention, then name the source path or command that establishes it. For config drift, inspect the repository's actual spec, source, test, or configuration for comparison_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the config drift decision for environment-config.config-drift.

Acceptance target: fixture:infrastructure.environment-config.config-drift:repository-context. Given environment-config.config-drift has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.
minimal: authoritative sources — ["config/production.json"].
mid: comparison schedule — "daily".
maximal: silent drift acceptance — false.
