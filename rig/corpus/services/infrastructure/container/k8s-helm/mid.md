# infrastructure.container.k8s-helm — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for k8s helm; it does not widen ownership beyond container.k8s-helm. For k8s helm, inspect these context signals: readiness_probe. Binding checks: k8s-helm-container-context.

Inspect the existing repository's k8s helm convention, then name the source path or command that establishes it. For k8s helm, inspect the repository's actual spec, source, test, or configuration for readiness_probe; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the k8s helm decision for container.k8s-helm.

Acceptance target: fixture:infrastructure.container.k8s-helm:repository-context. Given container.k8s-helm has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.
minimal: resource limits — ["cpu","memory"].
mid: readiness probe — "/health".
maximal: latest image tag — false.
