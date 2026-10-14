# testing.maintenance.test-code-sync — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for test code sync; it does not widen ownership beyond maintenance.test-code-sync. For test code sync, inspect these context signals: updated_cases. Binding checks: test-code-sync-maintenance-context.

Anchor the review on the existing repository's test code sync convention, then name the source path or command that establishes it. For test code sync, inspect the repository's actual spec, source, test, or configuration for updated_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring maintenance services outside the test code sync decision for maintenance.test-code-sync.

Acceptance target: fixture:testing.maintenance.test-code-sync:repository-context. Given maintenance.test-code-sync has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.
minimal: changed behaviors — ["owner is required"].
mid: updated cases — ["reject missing owner"].
maximal: tests follow output blindly — false.
