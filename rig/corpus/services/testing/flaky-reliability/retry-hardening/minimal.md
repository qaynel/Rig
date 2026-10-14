# testing.flaky-reliability.retry-hardening — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for retry hardening. The minimal boundary for retry hardening checks retryable_failures (nonempty): retryable failures must name the concrete repository contract.. Binding checks: retry-hardening-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.retry-hardening; bind it to the input named in `rig-services/testing.flaky-reliability.retry-hardening.json` and preserve the check's failure status. When adopting this in an existing repository, connect retry hardening to the command that inspects retryable_failures and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.retry-hardening as a failure.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:policy-boundary. Given source-code is present and flaky-reliability.retry-hardening is selected, pass only when the repository binding evaluates flaky-reliability.retry-hardening and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. The ceiling is retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Choose a repository-owned check that observes retry hardening from rig-services/testing.flaky-reliability.retry-hardening.json..

Service-specific evidence cues:
Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.
minimal: retryable failures — ["connection reset"].
mid: maximum attempts — 3.
maximal: retry assertion failures — false.
