# infrastructure.environment-config.config-drift - maximal

Grade: maximal (Evidence target). Until a rerunnable receipt exists, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal and mid checks pass, `config-drift-evidence-receipt` covers `environment-config.config-drift`. Given the environment-config.config-drift binding and its inputs are unchanged, it passes only when a second run reproduces the verdict and input/output digests; it fails when the receipt is stale, incomplete, or cannot be rerun. The receipt at `fixture:infrastructure.environment-config.config-drift:evidence-replay` names the binding, inputs, outcome, and current digest.
