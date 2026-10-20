# infrastructure.container.image-optimization — minimal

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade, minimal: Pin the base image by digest. A tag can change underneath the build, so record the immutable digest. Binding checks: image-optimization-source-code-boundary.

Acceptance target: policy:infrastructure.container.image-optimization:minimal:image-optimization-source-code-boundary.
Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array).
