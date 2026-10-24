# infrastructure.container.image-optimization — maximal

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade, maximal: Set including build secrets to false. Secrets copied into layers persist in the image, so use build-time mounts that leave no layer. Cumulative with minimal and mid. Binding checks: image-optimization-source-code-boundary, image-optimization-container-context, image-optimization-evidence-receipt.

Acceptance target: policy:infrastructure.container.image-optimization:maximal:image-optimization-source-code-boundary+image-optimization-container-context+image-optimization-evidence-receipt.
Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array); image-optimization-container-context: `runtime_user` is nonempty (a string or array); image-optimization-evidence-receipt: `include_build_secrets` equals false.
