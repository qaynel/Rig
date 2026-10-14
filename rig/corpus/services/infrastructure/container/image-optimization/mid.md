# infrastructure.container.image-optimization — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for image optimization; it does not widen ownership beyond container.image-optimization. For image optimization, inspect these context signals: runtime_user. Binding checks: image-optimization-container-context.

Tie acceptance to the existing repository's image optimization convention, then name the source path or command that establishes it. For image optimization, inspect the repository's actual spec, source, test, or configuration for runtime_user; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the image optimization decision for container.image-optimization.

Acceptance target: fixture:infrastructure.container.image-optimization:repository-context. Given container.image-optimization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.
minimal: base image digest — "sha256:abcd".
mid: runtime user — "nonroot".
maximal: include build secrets — false.
