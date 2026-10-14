# testing.maintenance.test-code-sync — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for test code sync; it does not widen ownership beyond maintenance.test-code-sync. The context signals are updated_cases. Binding checks: test-code-sync-maintenance-context.

Anchor the review on the existing repository's test code sync convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in maintenance under their own verdicts.

Acceptance target: fixture:testing.maintenance.test-code-sync:repository-context. Given maintenance.test-code-sync has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`.

Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed behaviors — ["owner is required"].

mid: updated cases — ["reject missing owner"].

maximal: tests follow output blindly — false.
