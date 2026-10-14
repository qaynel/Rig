# testing.flaky-reliability.retry-hardening — minimal

Minimal establishes a non-vacuous policy boundary for retry hardening. It checks retryable_failures (nonempty): retryable failures must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.retry-hardening; bind it to the input named in `rig-services/testing.flaky-reliability.retry-hardening.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside flaky-reliability.retry-hardening is a failure.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:policy-boundary. Given source-code is present and flaky-reliability.retry-hardening is selected, pass only when the repository binding evaluates flaky-reliability.retry-hardening and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. A passing policy check does not establish runtime behavior.
