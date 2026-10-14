# testing.strategy.pyramid-balance — mid

Mid adds repository context for pyramid balance; it does not widen ownership beyond strategy.pyramid-balance. The context signals are integration_suites.

Read the existing repository's pyramid balance convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in strategy under their own verdicts.

Acceptance target: fixture:testing.strategy.pyramid-balance:repository-context. Given strategy.pyramid-balance has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent strategy concern; fail when the result infers local convention without an inspectable source.
