# infrastructure.container.k8s-helm — maximal

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade, maximal: Set a latest image tag to false. A mutable tag changes what is deployed without a change record, so pin an exact version or digest. Cumulative with minimal and mid. Binding checks: k8s-helm-source-code-boundary, k8s-helm-container-context, k8s-helm-evidence-receipt.

Acceptance target: policy:infrastructure.container.k8s-helm:maximal:k8s-helm-source-code-boundary+k8s-helm-container-context+k8s-helm-evidence-receipt.
Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array); k8s-helm-container-context: `readiness_probe` is nonempty (a string or array); k8s-helm-evidence-receipt: `latest_image_tag` equals false.
