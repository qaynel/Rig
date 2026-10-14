# testing.flaky-reliability.retry-hardening — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for retry hardening; it does not widen ownership beyond flaky-reliability.retry-hardening. For retry hardening, inspect these context signals: maximum_attempts. Binding checks: retry-hardening-flaky-reliability-context.

Inspect the existing repository's retry hardening convention, then name the source path or command that establishes it. For retry hardening, inspect the repository's actual spec, source, test, or configuration for maximum_attempts; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the retry hardening decision for flaky-reliability.retry-hardening.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:repository-context. Given flaky-reliability.retry-hardening has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent flaky reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.
minimal: retryable failures — ["connection reset"].
mid: maximum attempts — 3.
maximal: retry assertion failures — false.
