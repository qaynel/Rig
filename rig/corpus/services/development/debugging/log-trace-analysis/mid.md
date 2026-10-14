# development.debugging.log-trace-analysis — mid

Mid adds repository context for log trace analysis; it does not widen ownership beyond debugging.log-trace-analysis. The context signals are redacted_fields.

Anchor the review on the existing repository's log trace analysis convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in debugging under their own verdicts.

Acceptance target: fixture:development.debugging.log-trace-analysis:repository-context. Given debugging.log-trace-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.
