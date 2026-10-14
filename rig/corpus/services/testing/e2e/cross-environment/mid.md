# testing.e2e.cross-environment — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for cross environment; it does not widen ownership beyond e2e.cross-environment. The context signals are shared_cases. Binding checks: cross-environment-e2e-context.

Start from the existing repository's cross environment convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in e2e under their own verdicts.

Acceptance target: fixture:testing.e2e.cross-environment:repository-context. Given e2e.cross-environment has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`.

Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["linux","macos"].

mid: shared cases — ["install and run"].

maximal: assume platform equivalence — false.
