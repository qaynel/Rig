# testing.e2e.cross-environment — mid

Mid adds repository context for cross environment; it does not widen ownership beyond e2e.cross-environment. The context signals are shared_cases.

Start from the existing repository's cross environment convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in e2e under their own verdicts.

Acceptance target: fixture:testing.e2e.cross-environment:repository-context. Given e2e.cross-environment has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.
