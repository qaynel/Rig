# infrastructure.container.image-optimization — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for image optimization; it does not widen ownership beyond container.image-optimization. The context signals are runtime_user. Binding checks: image-optimization-container-context.

Tie acceptance to the existing repository's image optimization convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in container under their own verdicts.

Acceptance target: fixture:infrastructure.container.image-optimization:repository-context. Given container.image-optimization has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Owned scope: `container.image-optimization`.

Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Input: `rig-services/infrastructure.container.image-optimization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior.

minimal: base image digest — "sha256:abcd".

mid: runtime user — "nonroot".

maximal: include build secrets — false.
