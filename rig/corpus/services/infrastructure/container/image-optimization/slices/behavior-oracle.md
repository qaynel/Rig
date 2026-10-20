# infrastructure.container.image-optimization — behavior-oracle slice

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Policy grade slice `image-optimization-slice-behavior-oracle`: Pin the base image by digest. A tag can change underneath the build, so record the immutable digest. Despite its name this slice is not a behavior oracle: it confirms the base image digest, runtime user and the build-secret flag are declared; it does not inspect a built image.
