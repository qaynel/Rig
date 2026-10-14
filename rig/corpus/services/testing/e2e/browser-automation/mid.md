# testing.e2e.browser-automation — mid

Mid adds repository context for browser automation; it does not widen ownership beyond e2e.browser-automation. The context signals are interaction_steps.

Start from the existing repository's browser automation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in e2e under their own verdicts.

Acceptance target: fixture:testing.e2e.browser-automation:repository-context. Given e2e.browser-automation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent e2e concern; fail when the result infers local convention without an inspectable source.
