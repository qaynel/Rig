# infrastructure.container.image-optimization — floor and mutation-floor slice

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade slice. This slice bounds image optimization to container.image-optimization. It uses `image-optimization-slice-floor` and checks base_image_digest (nonempty): base image digest must name the concrete repository contract.