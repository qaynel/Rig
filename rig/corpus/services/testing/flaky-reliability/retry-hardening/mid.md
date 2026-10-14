# testing.flaky-reliability.retry-hardening — mid

Mid adds repository context for retry hardening; it does not widen ownership beyond flaky-reliability.retry-hardening. The context signals are maximum_attempts.

Inspect the existing repository's retry hardening convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in flaky-reliability under their own verdicts.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:repository-context. Given flaky-reliability.retry-hardening has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.
