# infrastructure.container.image-optimization — identity

Policy grade: image optimization owns container.image-optimization. Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Keep neighboring container services outside the image optimization decision for container.image-optimization. Trace the verdict to the configured input at `rig-services/infrastructure.container.image-optimization.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Choose a repository-owned check that observes image optimization from rig-services/infrastructure.container.image-optimization.json.

Acceptance target: policy:infrastructure.container.image-optimization:minimal:image-optimization-source-code-boundary.

Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array).
