# infrastructure.container.image-optimization — minimal

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for image optimization. The minimal boundary for image optimization checks base_image_digest (nonempty): base image digest must name the concrete repository contract. Binding checks: image-optimization-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe container.image-optimization; bind it to the input named in `rig-services/infrastructure.container.image-optimization.json` and preserve the check's failure status. When adopting this in an existing repository, connect image optimization to the command that inspects base_image_digest and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.image-optimization as a failure.

Acceptance target: policy:infrastructure.container.image-optimization:minimal:image-optimization-source-code-boundary.

Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array).
