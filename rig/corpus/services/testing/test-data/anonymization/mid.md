# testing.test-data.anonymization — mid

Mid adds repository context for anonymization; it does not widen ownership beyond test-data.anonymization. The context signals are replacement_strategy.

Ground the decision in the existing repository's anonymization convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in test-data under their own verdicts.

Acceptance target: fixture:testing.test-data.anonymization:repository-context. Given test-data.anonymization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.
