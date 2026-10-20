# image-optimization

Pin the container base and use an unprivileged runtime user. Build secrets must not enter the resulting image layers; config inspection alone cannot verify a built image.

Owned scope: `container.image-optimization`. Input: `rig-services/infrastructure.container.image-optimization.json`.

Coverage ceiling: Configuration validation only, so it confirms the base image digest, runtime user and the build-secret flag are declared; it does not inspect a built image.

minimal: base image digest — "sha256:abcd". Pin the base image by digest. A tag can change underneath the build, so record the immutable digest.

mid: runtime user — "nonroot". Name an unprivileged runtime user. Running as root widens the blast radius, so declare a non-root user.

maximal: include build secrets — false. Set including build secrets to false. Secrets copied into layers persist in the image, so use build-time mounts that leave no layer.
