# testing.integration.internal-contract - maximal

Grade: maximal (Evidence target). Until a rerunnable receipt exists, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal and mid checks pass, `internal-contract-evidence-receipt` covers `integration.internal-contract`. Given the integration.internal-contract binding and its inputs are unchanged, it passes only when a second run reproduces the verdict and input/output digests; it fails when the receipt is stale, incomplete, or cannot be rerun. The receipt at `fixture:testing.integration.internal-contract:evidence-replay` names the binding, inputs, outcome, and current digest.
