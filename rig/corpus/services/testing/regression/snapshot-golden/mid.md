# testing.regression.snapshot-golden — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for snapshot golden; it does not widen ownership beyond regression.snapshot-golden. For snapshot golden, inspect these context signals: reviewed_diffs. Binding checks: snapshot-golden-regression-context.

Inspect the existing repository's snapshot golden convention, then name the source path or command that establishes it. For snapshot golden, inspect the repository's actual spec, source, test, or configuration for reviewed_diffs; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the snapshot golden decision for regression.snapshot-golden.

Acceptance target: fixture:testing.regression.snapshot-golden:repository-context. Given regression.snapshot-golden has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.
minimal: golden paths — ["fixtures/order.json"].
mid: reviewed diffs — ["field addition"].
maximal: automatic snapshot acceptance — false.
