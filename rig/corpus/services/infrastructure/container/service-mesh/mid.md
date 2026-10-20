# infrastructure.container.service-mesh — mid

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade, mid: Declare the transport security mode, such as mutual TLS. Without it service traffic may be unauthenticated, so state the required mode. Cumulative with minimal. Binding checks: service-mesh-source-code-boundary, service-mesh-container-context.

Acceptance target: policy:infrastructure.container.service-mesh:mid:service-mesh-source-code-boundary+service-mesh-container-context.
Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array); service-mesh-container-context: `transport_security` is nonempty (a string or array).
