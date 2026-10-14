# product-security.red-team.blast-radius — mid

Mid adds repository context for blast radius; it does not widen ownership beyond red-team.blast-radius. The context signals are isolation_boundaries.

Trace the verdict to the existing repository's blast radius convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.blast-radius:repository-context. Given red-team.blast-radius has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.
