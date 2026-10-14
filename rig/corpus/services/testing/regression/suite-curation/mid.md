# testing.regression.suite-curation — mid

Mid adds repository context for suite curation; it does not widen ownership beyond regression.suite-curation. The context signals are retirement_reasons.

Start from the existing repository's suite curation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in regression under their own verdicts.

Acceptance target: fixture:testing.regression.suite-curation:repository-context. Given regression.suite-curation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent regression concern; fail when the result infers local convention without an inspectable source.
