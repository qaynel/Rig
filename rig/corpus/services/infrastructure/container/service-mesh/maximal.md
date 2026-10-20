# infrastructure.container.service-mesh — maximal

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade, maximal: Set allowing plaintext fallback to false. A silent downgrade undermines the declared boundary, so reject unencrypted connections. Cumulative with minimal and mid. Binding checks: service-mesh-source-code-boundary, service-mesh-container-context, service-mesh-evidence-receipt.

Acceptance target: policy:infrastructure.container.service-mesh:maximal:service-mesh-source-code-boundary+service-mesh-container-context+service-mesh-evidence-receipt.
Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array); service-mesh-container-context: `transport_security` is nonempty (a string or array); service-mesh-evidence-receipt: `allow_plaintext_fallback` equals false.
