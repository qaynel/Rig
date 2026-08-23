# testing.property-fuzz.invariant-identification - maximal

Grade: maximal (Evidence target). Until a rerunnable receipt exists, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal and mid checks pass, `invariant-identification-evidence-receipt` covers `property-fuzz.invariant-identification`. Given the property-fuzz.invariant-identification binding and its inputs are unchanged, it passes only when a second run reproduces the verdict and input/output digests; it fails when the receipt is stale, incomplete, or cannot be rerun. The receipt at `fixture:testing.property-fuzz.invariant-identification:evidence-replay` names the binding, inputs, outcome, and current digest.
