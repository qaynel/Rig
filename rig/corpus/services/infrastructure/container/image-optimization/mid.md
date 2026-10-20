# infrastructure.container.image-optimization — mid

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade, mid: Name an unprivileged runtime user. Running as root widens the blast radius, so declare a non-root user. Cumulative with minimal. Binding checks: image-optimization-source-code-boundary, image-optimization-container-context.

Acceptance target: policy:infrastructure.container.image-optimization:mid:image-optimization-source-code-boundary+image-optimization-container-context.
Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array); image-optimization-container-context: `runtime_user` is nonempty (a string or array).
