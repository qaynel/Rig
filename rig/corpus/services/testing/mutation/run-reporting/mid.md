# testing.mutation.run-reporting — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for run reporting; it does not widen ownership beyond mutation.run-reporting. For run reporting, inspect these context signals: input_revision. Binding checks: run-reporting-mutation-context.

Use the existing repository's run reporting convention, then name the source path or command that establishes it. For run reporting, inspect the repository's actual spec, source, test, or configuration for input_revision; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the run reporting decision for mutation.run-reporting.

Acceptance target: fixture:testing.mutation.run-reporting:repository-context. Given mutation.run-reporting has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.
minimal: reported outcomes — ["killed","survived","timeout"].
mid: input revision — "a1b2c3d".
maximal: publish raw secrets — false.
