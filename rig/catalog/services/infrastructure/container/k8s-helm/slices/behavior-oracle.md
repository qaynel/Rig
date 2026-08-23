# infrastructure.container.k8s-helm - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming k8s helm result from a real policy violation. It activates `k8s-helm-source-code-boundary`, `k8s-helm-container-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
