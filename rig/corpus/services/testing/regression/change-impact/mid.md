# testing.regression.change-impact — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for change impact; it does not widen ownership beyond regression.change-impact. For change impact, inspect these context signals: affected_suites. Binding checks: change-impact-regression-context.

Start from the existing repository's change impact convention, then name the source path or command that establishes it. For change impact, inspect the repository's actual spec, source, test, or configuration for affected_suites; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the change impact decision for regression.change-impact.

Acceptance target: fixture:testing.regression.change-impact:repository-context. Given regression.change-impact has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.
minimal: changed interfaces — ["order serializer"].
mid: affected suites — ["order contract"].
maximal: select by filename only — false.
