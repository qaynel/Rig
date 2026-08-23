# testing.flaky-reliability.detection-quarantine - maximal

Grade: maximal (Evidence target). Until a rerunnable receipt exists, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal and mid checks pass, `detection-quarantine-evidence-receipt` covers `flaky-reliability.detection-quarantine`. Given the flaky-reliability.detection-quarantine binding and its inputs are unchanged, it passes only when a second run reproduces the verdict and input/output digests; it fails when the receipt is stale, incomplete, or cannot be rerun. The receipt at `fixture:testing.flaky-reliability.detection-quarantine:evidence-replay` names the binding, inputs, outcome, and current digest.
