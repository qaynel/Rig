# testing.flaky-reliability.retry-hardening — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for retry hardening; it does not widen ownership beyond flaky-reliability.retry-hardening. The context signals are maximum_attempts. Binding checks: retry-hardening-flaky-reliability-context.

Inspect the existing repository's retry hardening convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in flaky-reliability under their own verdicts.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:repository-context. Given flaky-reliability.retry-hardening has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Owned scope: `flaky-reliability.retry-hardening`.

Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Input: `rig-services/testing.flaky-reliability.retry-hardening.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

minimal: retryable failures — ["connection reset"].

mid: maximum attempts — 3.

maximal: retry assertion failures — false.
