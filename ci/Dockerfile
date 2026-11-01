# One Linux test environment for CI and for `npm run test:linux`.
# Same image on a Mac (Docker Desktop) and on GitHub, so a Linux-only failure
# reproduces before push. Pinned tools: no "latest" drift.
FROM ubuntu:24.04

ARG TARGETARCH
ARG BUN_VERSION=1.4.0
ARG GITLEAKS_VERSION=8.30.1

RUN apt-get update \
 && apt-get install --yes --no-install-recommends \
      bubblewrap ca-certificates curl git openssh-client procps iproute2 python3 python3-venv unzip xz-utils zip \
 && rm -rf /var/lib/apt/lists/*

# Node 22 from the official image (same major CI used via setup-node).
COPY --from=node:22-bookworm-slim /usr/local/ /usr/local/

# Checksums are the vendors' published SHASUMS, verified at build time.
RUN set -eu; \
    case "$TARGETARCH" in \
      amd64) BUN=x64;     BUN_SHA=2d03fb5fb83ac8b567aca0a281b2ce1a1a19d488f56c2968d88c3f25e92fe452; \
             GL=x64;      GL_SHA=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb ;; \
      arm64) BUN=aarch64; BUN_SHA=4b1a332ee861983eb93bcfe6f770fff94e3e31b2c388bdaea3c8ed35e58eed0e; \
             GL=arm64;    GL_SHA=e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080 ;; \
      *) echo "unsupported arch $TARGETARCH" >&2; exit 1 ;; \
    esac; \
    curl -fsSL -o /tmp/bun.zip "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/bun-linux-${BUN}.zip"; \
    echo "${BUN_SHA}  /tmp/bun.zip" | sha256sum -c -; \
    unzip -q /tmp/bun.zip -d /tmp/bun; install -m 0755 "/tmp/bun/bun-linux-${BUN}/bun" /usr/local/bin/bun; \
    curl -fsSL -o /tmp/gl.tgz "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_${GL}.tar.gz"; \
    echo "${GL_SHA}  /tmp/gl.tgz" | sha256sum -c -; \
    mkdir -p /opt/gitleaks && tar -xzf /tmp/gl.tgz -C /opt/gitleaks gitleaks; \
    rm -rf /tmp/bun /tmp/bun.zip /tmp/gl.tgz

# The tests look here for the pinned scanner.
ENV RIG_TEST_GITLEAKS=/opt/gitleaks/gitleaks
# A missing bun must fail, not skip.
ENV RIG_REQUIRE_PROCESS_CLEANUP=1
# The container runs as root on a mounted checkout.
RUN git config --global --add safe.directory '*'

WORKDIR /work
