# infrastructure.container.image-optimization — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for image optimization. The evidence must preserve the base_image_digest, runtime_user, include_build_secrets inputs that determined the result. Binding checks: image-optimization-evidence-receipt.

Read a second run against unchanged image optimization inputs. Record the base_image_digest, runtime_user, include_build_secrets inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this image optimization result is stale. The ceiling remains: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Choose a repository-owned check that observes image optimization from rig-services/infrastructure.container.image-optimization.json.

Acceptance target: fixture:infrastructure.container.image-optimization:evidence-replay. Given the container.image-optimization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.
minimal: base image digest — "sha256:abcd".
mid: runtime user — "nonroot".
maximal: include build secrets — false.
