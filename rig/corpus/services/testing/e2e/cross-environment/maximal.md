# testing.e2e.cross-environment — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for cross environment. The evidence must preserve the environments, shared_cases, assume_platform_equivalence inputs that determined the result. Binding checks: cross-environment-evidence-receipt.

Trace the verdict to a second run against unchanged cross environment inputs. Record the environments, shared_cases, assume_platform_equivalence inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this cross environment result is stale. The ceiling remains: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Choose a repository-owned check that observes cross environment from rig-services/testing.e2e.cross-environment.json.

Acceptance target: fixture:testing.e2e.cross-environment:evidence-replay. Given the e2e.cross-environment binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.
minimal: environments — ["linux","macos"].
mid: shared cases — ["install and run"].
maximal: assume platform equivalence — false.
