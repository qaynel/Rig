# infrastructure.container.service-mesh — mid

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: service-mesh-source-code-boundary, service-mesh-container-context.

Start from the existing repository's service mesh convention, then name the source path or command that establishes it. For service mesh, inspect the repository's actual spec, source, test, or configuration for transport_security; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the service mesh decision for container.service-mesh.

Acceptance target: policy:infrastructure.container.service-mesh:mid:service-mesh-source-code-boundary+service-mesh-container-context.

Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array); service-mesh-container-context: `transport_security` is nonempty (a string or array).
