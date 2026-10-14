# testing.e2e.cross-environment — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for cross environment. The evidence must preserve the environments, shared_cases, assume_platform_equivalence inputs that determined the result. Binding checks: cross-environment-evidence-receipt.

Trace the verdict to a second run against unchanged cross environment inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.cross-environment:evidence-replay. Given the e2e.cross-environment binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`.

Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["linux","macos"].

mid: shared cases — ["install and run"].

maximal: assume platform equivalence — false.
