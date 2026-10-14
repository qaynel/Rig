# infrastructure.container.image-optimization — floor and mutation-floor slice

Policy grade slice. This slice bounds image optimization to container.image-optimization. It uses `image-optimization-slice-floor` and checks base_image_digest (nonempty): base image digest must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.container.image-optimization.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Owned scope: `container.image-optimization`.

Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Input: `rig-services/infrastructure.container.image-optimization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: image optimization configuration validation only; declared policy does not prove running image optimization behavior. Select an approved repository-owned command to verify that behavior.

minimal: base image digest — "sha256:abcd".

mid: runtime user — "nonroot".

maximal: include build secrets — false.
