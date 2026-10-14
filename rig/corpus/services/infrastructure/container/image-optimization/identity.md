# infrastructure.container.image-optimization — identity

image optimization owns container.image-optimization. Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Keep sibling services in container under their own verdicts. Trace the verdict to the configured input at `rig-services/infrastructure.container.image-optimization.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.image-optimization:policy-boundary. Given source-code is present and container.image-optimization is selected, pass only when the repository binding evaluates container.image-optimization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.
