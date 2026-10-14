# testing.regression.change-impact — mid

Mid adds repository context for change impact; it does not widen ownership beyond regression.change-impact. The context signals are affected_suites.

Start from the existing repository's change impact convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in regression under their own verdicts.

Acceptance target: fixture:testing.regression.change-impact:repository-context. Given regression.change-impact has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.
