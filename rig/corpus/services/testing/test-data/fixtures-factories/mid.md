# testing.test-data.fixtures-factories — mid

Mid adds repository context for fixtures factories; it does not widen ownership beyond test-data.fixtures-factories. The context signals are explicit_variants.

Trace the verdict to the existing repository's fixtures factories convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in test-data under their own verdicts.

Acceptance target: fixture:testing.test-data.fixtures-factories:repository-context. Given test-data.fixtures-factories has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.
