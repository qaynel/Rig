# infrastructure.container.image-optimization — behavior-oracle slice

Policy grade slice. This slice bounds image optimization to container.image-optimization. It uses `image-optimization-slice-behavior-oracle` and checks base_image_digest (nonempty): base image digest must name the concrete repository contract..

For image optimization, choose a repository example that satisfies base_image_digest at the behavior-oracle floor, plus a failure where base image digest must name the concrete repository contract. is false. For image optimization, wire `behavior-oracle` to `rig-services/infrastructure.container.image-optimization.json` and keep its verdict on base_image_digest; missing evidence is a named gap, with ceiling image optimization configuration validation only; declared policy does not prove running image optimization behavior. Choose a repository-owned check that observes image optimization from rig-services/infrastructure.container.image-optimization.json..

Service-specific evidence cues:
Offer: Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.
minimal: base image digest — "sha256:abcd".
mid: runtime user — "nonroot".
maximal: include build secrets — false.
