# infrastructure.container.image-optimization — mid

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: image-optimization-source-code-boundary, image-optimization-container-context.

Tie acceptance to the existing repository's image optimization convention, then name the source path or command that establishes it. For image optimization, inspect the repository's actual spec, source, test, or configuration for runtime_user; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the image optimization decision for container.image-optimization.

Acceptance target: policy:infrastructure.container.image-optimization:mid:image-optimization-source-code-boundary+image-optimization-container-context.

Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array); image-optimization-container-context: `runtime_user` is nonempty (a string or array).
