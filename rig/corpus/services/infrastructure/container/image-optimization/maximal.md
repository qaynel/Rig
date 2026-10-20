# infrastructure.container.image-optimization — maximal

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: image-optimization-source-code-boundary, image-optimization-container-context, image-optimization-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.container.image-optimization:maximal:image-optimization-source-code-boundary+image-optimization-container-context+image-optimization-evidence-receipt.

Declared predicates: image-optimization-source-code-boundary: `base_image_digest` is nonempty (a string or array); image-optimization-container-context: `runtime_user` is nonempty (a string or array); image-optimization-evidence-receipt: `include_build_secrets` equals false.
