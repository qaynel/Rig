# testing.strategy.coverage-gap — mid

Mid adds repository context for coverage gap; it does not widen ownership beyond strategy.coverage-gap. The context signals are risk_owners.

Trace the verdict to the existing repository's coverage gap convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.coverage-gap:repository-context. Given strategy.coverage-gap has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.
