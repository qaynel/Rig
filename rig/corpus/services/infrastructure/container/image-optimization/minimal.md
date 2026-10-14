# infrastructure.container.image-optimization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for image optimization. The minimal boundary for image optimization checks base_image_digest (nonempty): base image digest must name the concrete repository contract.. Binding checks: image-optimization-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe container.image-optimization; bind it to the input named in `rig-services/infrastructure.container.image-optimization.json` and preserve the check's failure status. When adopting this in an existing repository, connect image optimization to the command that inspects base_image_digest and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.image-optimization as a failure.

Acceptance target: fixture:infrastructure.container.image-optimization:policy-boundary. Given source-code is present and container.image-optimization is selected, pass only when the repository binding evaluates container.image-optimization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. The ceiling is image optimization configuration validation only; declared policy does not prove running image optimization behavior. Choose a repository-owned check that observes image optimization from rig-services/infrastructure.container.image-optimization.json..

Service-specific evidence cues:
Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.
minimal: base image digest — "sha256:abcd".
mid: runtime user — "nonroot".
maximal: include build secrets — false.
