# testing.e2e.cross-environment — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for cross environment; it does not widen ownership beyond e2e.cross-environment. For cross environment, inspect these context signals: shared_cases. Binding checks: cross-environment-e2e-context.

Start from the existing repository's cross environment convention, then name the source path or command that establishes it. For cross environment, inspect the repository's actual spec, source, test, or configuration for shared_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring e2e services outside the cross environment decision for e2e.cross-environment.

Acceptance target: fixture:testing.e2e.cross-environment:repository-context. Given e2e.cross-environment has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.
minimal: environments — ["linux","macos"].
mid: shared cases — ["install and run"].
maximal: assume platform equivalence — false.
