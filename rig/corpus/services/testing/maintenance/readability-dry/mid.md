# testing.maintenance.readability-dry — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for readability dry; it does not widen ownership beyond maintenance.readability-dry. For readability dry, inspect these context signals: shared_helpers. Binding checks: readability-dry-maintenance-context.

Anchor the review on the existing repository's readability dry convention, then name the source path or command that establishes it. For readability dry, inspect the repository's actual spec, source, test, or configuration for shared_helpers; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring maintenance services outside the readability dry decision for maintenance.readability-dry.

Acceptance target: fixture:testing.maintenance.readability-dry:repository-context. Given maintenance.readability-dry has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.
minimal: scenario names — ["expired token is rejected"].
mid: shared helpers — ["create valid account"].
maximal: hide assertions in helpers — false.
