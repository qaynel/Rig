# infrastructure.container.k8s-helm — maximal

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: k8s-helm-source-code-boundary, k8s-helm-container-context, k8s-helm-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.container.k8s-helm:maximal:k8s-helm-source-code-boundary+k8s-helm-container-context+k8s-helm-evidence-receipt.

Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array); k8s-helm-container-context: `readiness_probe` is nonempty (a string or array); k8s-helm-evidence-receipt: `latest_image_tag` equals false.
