# infrastructure.container.image-optimization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for image optimization. It checks base_image_digest (nonempty): base image digest must name the concrete repository contract.. Binding checks: image-optimization-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe container.image-optimization; bind it to the input named in `rig-services/infrastructure.container.image-optimization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside container.image-optimization is a failure.

Acceptance target: fixture:infrastructure.container.image-optimization:policy-boundary. Given source-code is present and container.image-optimization is selected, pass only when the repository binding evaluates container.image-optimization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Owned scope: `container.image-optimization`.

Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Input: `rig-services/infrastructure.container.image-optimization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior.

minimal: base image digest — "sha256:abcd".

mid: runtime user — "nonroot".

maximal: include build secrets — false.
