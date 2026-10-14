# infrastructure.container.image-optimization — maximal

Maximal adds a replayable evidence receipt for image optimization. The evidence must preserve the base_image_digest, runtime_user, include_build_secrets inputs that determined the result.

Read a second run against unchanged image optimization inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.image-optimization:evidence-replay. Given the container.image-optimization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
