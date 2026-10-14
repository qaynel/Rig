# testing.flaky-reliability.retry-hardening — floor and mutation-floor slice

Policy grade slice. This slice bounds retry hardening to flaky-reliability.retry-hardening. It uses `retry-hardening-slice-floor` and checks retryable_failures (nonempty): retryable failures must name the concrete repository contract..

For retry hardening, choose a repository example that satisfies retryable_failures at the floor and mutation-floor floor, plus a failure where retryable failures must name the concrete repository contract. is false. For retry hardening, wire `floor and mutation-floor` to `rig-services/testing.flaky-reliability.retry-hardening.json` and keep its verdict on retryable_failures; missing evidence is a named gap, with ceiling retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Choose a repository-owned check that observes retry hardening from rig-services/testing.flaky-reliability.retry-hardening.json..

Service-specific evidence cues:
Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.
minimal: retryable failures — ["connection reset"].
mid: maximum attempts — 3.
maximal: retry assertion failures — false.
