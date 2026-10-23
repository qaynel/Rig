# infrastructure.container.image-optimization — identity

Policy grade: image-optimization owns container.image-optimization. Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Input: `rig-services/infrastructure.container.image-optimization.json`. Configuration validation only, so it confirms the base image digest, runtime user and the build-secret flag are declared; it does not inspect a built image.

Disposition: executable.
Acceptance target: policy:infrastructure.container.image-optimization:minimal:image-optimization-source-code-boundary.
Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array).
