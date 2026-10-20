# k8s-helm

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`. Input: `rig-services/infrastructure.container.k8s-helm.json`.

Coverage ceiling: Configuration validation only, so it confirms resource limits, a readiness probe and the latest-tag flag are declared; it does not show the workload schedules or becomes ready.

minimal: resource limits — ["cpu","memory"]. Declare CPU and memory limits for the workload. Unbounded pods can starve the node, so set resource limits.

mid: readiness probe — "/health". Declare a readiness probe. Process existence is not readiness, so define the endpoint or command that proves the service can take traffic.

maximal: latest image tag — false. Set a latest image tag to false. A mutable tag changes what is deployed without a change record, so pin an exact version or digest.
