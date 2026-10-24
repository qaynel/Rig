# infrastructure.container.image-optimization — property-floor slice

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade slice `image-optimization-slice-property-floor`: Pin the base image by digest. A tag can change underneath the build, so record the immutable digest.
