# testing.mutation.run-reporting — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for run reporting; it does not widen ownership beyond mutation.run-reporting. The context signals are input_revision. Binding checks: run-reporting-mutation-context.

Use the existing repository's run reporting convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.run-reporting:repository-context. Given mutation.run-reporting has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Owned scope: `mutation.run-reporting`.

Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Input: `rig-services/testing.mutation.run-reporting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

minimal: reported outcomes — ["killed","survived","timeout"].

mid: input revision — "a1b2c3d".

maximal: publish raw secrets — false.
